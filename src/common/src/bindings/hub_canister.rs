// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports, deprecated)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;

#[derive(CandidType, Deserialize)]
pub struct Account {
  pub owner: Principal,
  pub subaccount: Option<serde_bytes::ByteBuf>,
}

pub struct Service(pub Principal);
impl Service {
  pub async fn complete_payment(&self, arg0: &u64) -> Result<(Principal,)> {
    ic_cdk::call(self.0, "complete_payment", (arg0,)).await
  }
  pub async fn get_vote_canister_wasm(&self) -> Result<(serde_bytes::ByteBuf,)> {
    ic_cdk::call(self.0, "get_vote_canister_wasm", ()).await
  }
  pub async fn list_daos(&self) -> Result<(Vec<Principal>,)> {
    ic_cdk::call(self.0, "list_daos", ()).await
  }
  pub async fn request_new_dao(&self) -> Result<(Account,)> {
    ic_cdk::call(self.0, "request_new_dao", ()).await
  }
  pub async fn set_dao_canister_wasm(&self, arg0: &serde_bytes::ByteBuf) -> Result<()> {
    ic_cdk::call(self.0, "set_dao_canister_wasm", (arg0,)).await
  }
  pub async fn set_vote_canister_wasm(&self, arg0: &serde_bytes::ByteBuf) -> Result<()> {
    ic_cdk::call(self.0, "set_vote_canister_wasm", (arg0,)).await
  }
}

