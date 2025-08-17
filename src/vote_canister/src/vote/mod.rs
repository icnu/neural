use std::cell::RefCell;
use candid::{Nat, Principal};
use common::bindings::{dao_canister::{ProposalVerdict, Service as DaoCanisterService}, siwe::Service as SiweService, token_index_canister::Service as TokenService};
use ic_stable_structures::{BTreeMap, Cell};
use serde_bytes::ByteBuf;
use crate::{memory::{id_to_memory, Memory, MemoryIds}, strategy::vote_deciding_strategy, vote::types::{InitArgs, VoteMetadata}};

pub mod types;

thread_local! {
    static VOTE_METADATA: RefCell<Cell<VoteMetadata, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::Metadata), VoteMetadata::default()).unwrap());
    static VOTE_CAST_INDEX: RefCell<BTreeMap<String, bool, Memory>> = RefCell::new(BTreeMap::init(id_to_memory(MemoryIds::VoteCastIndex)));
}

pub fn init(args: InitArgs) {
    VOTE_METADATA.with_borrow_mut(|cell| cell.set(VoteMetadata::new(args)).unwrap());
    VOTE_CAST_INDEX.with_borrow_mut(|map| map.clear_new());
}

pub fn get_metadata() -> VoteMetadata {
    VOTE_METADATA.with_borrow(|cell| cell.get().clone())
}

pub async fn cast_vote(user: Principal, vote: ProposalVerdict) {
    let metadata= get_metadata();
    let siwe_service = SiweService(Principal::from_text(option_env!("CANISTER_ID_HUB_CANISTER").unwrap()).unwrap());
    let token_service = TokenService(metadata.token_canister);

    let user_chain_address = siwe_service.get_address(&ByteBuf::from(user.as_slice())).await.unwrap().0.unwrap();
    let user_chain_address = user_chain_address.to_lowercase();
    let user_token_balance = token_service.get_token_balance_at_snapshot(&user_chain_address, &Nat::from(metadata.snapshot_id)).await.unwrap().0.unwrap();
    let user_token_balance: u128 = user_token_balance.0.try_into().unwrap();

    VOTE_CAST_INDEX.with_borrow_mut(|map| {
        if map.contains_key(&user_chain_address) {
            panic!("User has already cast vote.");
        }

        map.insert(user_chain_address, true);
    });

    VOTE_METADATA.with_borrow_mut(|cell| {
        let mut metadata = cell.get().clone();
        
        match vote {
            ProposalVerdict::Accepted => {
                metadata.vote_accept += user_token_balance;
            },
            ProposalVerdict::Rejected => {
                metadata.vote_reject += user_token_balance;
            }
        };

        cell.set(metadata).unwrap();
    });
}

pub async fn close_vote() {
    let metadata = get_metadata();
    let decision = vote_deciding_strategy(metadata.vote_accept, metadata.vote_reject);

    let service = DaoCanisterService(metadata.dao_canister);
    service.request_proposal_voting_close(&metadata.proposal_id, &decision).await.unwrap();
}