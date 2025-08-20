// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports, deprecated)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;

#[derive(CandidType, Deserialize)]
pub struct InitArgs {
  pub token_canister: Principal,
  pub proposal_id: u64,
  pub dao_canister: Principal,
  pub snapshot_id: u64,
}
#[derive(CandidType, Deserialize)]
pub enum ProposalVerdict {
  #[serde(rename="REJECTED")]
  Rejected,
  #[serde(rename="ACCEPTED")]
  Accepted,
}
#[derive(CandidType, Deserialize)]
pub struct VoteMetadata {
  pub token_canister: Principal,
  pub vote_reject: candid::Nat,
  pub vote_accept: candid::Nat,
  pub proposal_id: u64,
  pub dao_canister: Principal,
  pub snapshot_id: u64,
}

pub struct Service(pub Principal);
impl Service {
  pub async fn cast_vote(&self, arg0: &ProposalVerdict) -> Result<()> {
    ic_cdk::call(self.0, "cast_vote", (arg0,)).await
  }
  pub async fn close_vote(&self) -> Result<()> {
    ic_cdk::call(self.0, "close_vote", ()).await
  }
  pub async fn get_metadata(&self) -> Result<(VoteMetadata,)> {
    ic_cdk::call(self.0, "get_metadata", ()).await
  }
  pub async fn get_voting_power(&self) -> Result<(candid::Nat,)> {
    ic_cdk::call(self.0, "get_voting_power", ()).await
  }
  pub async fn has_cast_vote(&self) -> Result<(bool,)> {
    ic_cdk::call(self.0, "has_cast_vote", ()).await
  }
}

