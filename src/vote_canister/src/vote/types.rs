use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};

#[derive(CandidType, Deserialize)]
pub enum VoteDecision {
    Accept,
    Reject,
    Undecided
}

#[derive(CandidType, Deserialize)]
pub struct InitArgs {
    proposal_id: u64,
    token_canister: Principal,
    dao_canister: Principal,
    snapshot_id: u64,
}

impl Default for InitArgs {
    fn default() -> Self {
        Self {
            proposal_id: 0,
            token_canister: Principal::anonymous(),
            dao_canister: Principal::anonymous(),
            snapshot_id: 0,
        }
    }
}

#[derive(CandidType, Deserialize, Clone)]
pub struct VoteMetadata {
    pub proposal_id: u64,
    pub token_canister: Principal,
    pub dao_canister: Principal,
    pub snapshot_id: u64,
    pub vote_accept: u128,
    pub vote_reject: u128
}

impl Storable for VoteMetadata {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode VoteMetadata"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), VoteMetadata).expect("Failed to decode VoteMetadata")
    }
    
    const BOUND: Bound = Bound::Bounded { max_size: 256, is_fixed_size: true };
}

impl VoteMetadata {
    pub fn new(args: InitArgs) -> Self {
        Self {
            proposal_id: args.proposal_id,
            token_canister: args.token_canister,
            dao_canister: args.dao_canister,
            snapshot_id: args.snapshot_id,
            vote_accept: 0,
            vote_reject: 0
        }
    }
}

impl Default for VoteMetadata {
    fn default() -> Self {
        Self::new(InitArgs::default())
    }
}