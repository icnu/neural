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


