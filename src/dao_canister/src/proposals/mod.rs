use std::cell::RefCell;
use candid::Principal;
use common::bindings::token_index_canister::Service;
use ic_stable_structures::{BTreeMap, Cell};
use crate::{execution::execute_txn, get_metadata, memory::{id_to_memory, Memory, MemoryIds}, proposals::{deploy::deploy_vote_canister, types::{Proposal, ProposalMetadata, ProposalState, ProposalVerdict}}};

mod deploy;
mod types;

thread_local! {
    static PROPOSALS_ID: RefCell<Cell<u64, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::ProposalsId), 1).unwrap());
    static PROPOSALS: RefCell<BTreeMap<u64, Proposal, Memory>> = RefCell::new(BTreeMap::init(id_to_memory(MemoryIds::Proposals)));
}

fn get_proposals_id() -> u64 {
    PROPOSALS_ID.with_borrow(|cell| cell.get().clone())
}

fn incr_proposals_id() {
    PROPOSALS_ID.with_borrow_mut(|cell| cell.set(cell.get() + 1).unwrap());
}

pub async fn request_new_proposal(metadata: ProposalMetadata, proposer: Principal) -> u64 {
    let dao_metadata = get_metadata();
    if dao_metadata.token.is_none() { panic!("No token canister set"); }

    let id = get_proposals_id();
    let mut proposal = Proposal {
        id,
        title: metadata.title,
        description: metadata.description,
        execution_payload: metadata.execution_payload,
        proposer,
        snapshot_id: None,
        vote_canister: None,
        state: ProposalState::Init,
        verdict: None,
        execution_txn_hash: None
    };

    PROPOSALS.with_borrow_mut(|map| map.insert(id, proposal.clone()));
    incr_proposals_id();

    let token_canister = Service(dao_metadata.token.unwrap());
    let snapshot_id = token_canister.new_snapshot().await.unwrap().0.unwrap();

    proposal.snapshot_id = Some(snapshot_id.0.try_into().unwrap());
    PROPOSALS.with_borrow_mut(|map| map.insert(id, proposal.clone()));

    // deploy_vote_canister(id, creator) // TODO

    proposal.state = ProposalState::Open;
    PROPOSALS.with_borrow_mut(|map| map.insert(id, proposal.clone()));

    id
}

pub fn get_proposal(id: u64) -> Option<Proposal> {
    PROPOSALS.with_borrow(|map| map.get(&id))
}

pub async fn request_proposal_voting_close(id: u64, verdict: ProposalVerdict) {
    let mut proposal = get_proposal(id).unwrap();
    proposal.verdict = Some(verdict.clone());
    proposal.state = ProposalState::VotingClosed;
    
    PROPOSALS.with_borrow_mut(|map| map.insert(id, proposal.clone()));

    if verdict == ProposalVerdict::ACCEPTED && proposal.execution_payload.is_some() {
        let txn_hash = execute_txn(proposal.execution_payload.clone().unwrap()).await;
        proposal.execution_txn_hash = Some(txn_hash);

        PROPOSALS.with_borrow_mut(|map| map.insert(id, proposal.clone()));
    }
}