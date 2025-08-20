// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports, deprecated)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;

#[derive(CandidType, Deserialize)]
pub struct InitArgs { pub id: u64, pub creator: Principal }
#[derive(CandidType, Deserialize)]
pub struct Metadata {
  pub id: u64,
  pub hub: Principal,
  pub url: Option<String>,
  pub creator: Principal,
  pub token: Option<Principal>,
  pub logo: Option<String>,
  pub name: Option<String>,
}
#[derive(CandidType, Deserialize)]
pub enum ProposalVerdict {
  #[serde(rename="REJECTED")]
  Rejected,
  #[serde(rename="ACCEPTED")]
  Accepted,
}
#[derive(CandidType, Deserialize)]
pub enum ProposalState { VotingClosed, Init, Open, Executed }
#[derive(CandidType, Deserialize)]
pub struct EthereumExecutionData {
  pub to: String,
  pub value: candid::Nat,
  pub data: serde_bytes::ByteBuf,
  pub chain_id: candid::Nat,
  pub gas_limit: candid::Nat,
}
#[derive(CandidType, Deserialize)]
pub struct Proposal {
  pub id: u64,
  pub title: String,
  pub description: String,
  pub verdict: Option<ProposalVerdict>,
  pub state: ProposalState,
  pub execution_txn_hash: Option<String>,
  pub proposer: Principal,
  pub execution_payload: Option<EthereumExecutionData>,
  pub vote_canister: Option<Principal>,
  pub snapshot_id: Option<candid::Nat>,
}
#[derive(CandidType, Deserialize)]
pub struct ProposalMetadata {
  pub title: String,
  pub description: String,
  pub execution_payload: Option<EthereumExecutionData>,
}
#[derive(CandidType, Deserialize)]
pub struct MetadataUpdate {
  pub url: String,
  pub token: Principal,
  pub logo: String,
  pub name: String,
}

pub struct Service(pub Principal);
impl Service {
  pub async fn get_execution_address(&self) -> Result<(String,)> {
    ic_cdk::call(self.0, "get_execution_address", ()).await
  }
  pub async fn get_metadata(&self) -> Result<(Metadata,)> {
    ic_cdk::call(self.0, "get_metadata", ()).await
  }
  pub async fn get_proposal(&self, arg0: &u64) -> Result<(Option<Proposal>,)> {
    ic_cdk::call(self.0, "get_proposal", (arg0,)).await
  }
  pub async fn request_new_proposal(&self, arg0: &ProposalMetadata) -> Result<(u64,)> {
    ic_cdk::call(self.0, "request_new_proposal", (arg0,)).await
  }
  pub async fn request_proposal_voting_close(&self, arg0: &u64, arg1: &ProposalVerdict) -> Result<()> {
    ic_cdk::call(self.0, "request_proposal_voting_close", (arg0,arg1,)).await
  }
  pub async fn update_metadata(&self, arg0: &MetadataUpdate) -> Result<()> {
    ic_cdk::call(self.0, "update_metadata", (arg0,)).await
  }
}

