use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use crate::execution::EthereumExecutionData;

#[derive(CandidType, Deserialize, Clone)]
pub enum ProposalState {
    Init,
    Open,
    VotingClosed,
    Executed
}

#[derive(CandidType, Deserialize)]
pub struct ProposalMetadata {
    pub title: String,
    pub description: String,
    pub execution_payload: Option<EthereumExecutionData>,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub execution_payload: Option<EthereumExecutionData>,
    pub proposer: Principal,
    pub vote_canister: Option<Principal>,
    pub snapshot_id: Option<u128>,
    pub state: ProposalState,
    pub verdict: Option<ProposalVerdict>,
    pub execution_txn_hash: Option<String>
}

#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum ProposalVerdict {
    ACCEPTED,
    REJECTED
}

impl Storable for Proposal {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode Proposal"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Proposal).expect("Failed to decode Proposal")
    }
    
    const BOUND: Bound = Bound::Unbounded;
}
