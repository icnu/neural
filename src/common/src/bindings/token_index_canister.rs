// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports, deprecated)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;


pub struct Service(pub Principal);
impl Service {
  pub async fn add_feeder_agent(&self, arg0: &Principal) -> Result<()> {
    ic_cdk::call(self.0, "add_feeder_agent", (arg0,)).await
  }
  pub async fn delete_snapshot(&self, arg0: &candid::Nat) -> Result<()> {
    ic_cdk::call(self.0, "delete_snapshot", (arg0,)).await
  }
  pub async fn get_block_num(&self) -> Result<(candid::Nat,)> {
    ic_cdk::call(self.0, "get_block_num", ()).await
  }
  pub async fn get_token_balance(&self, arg0: &String) -> Result<(Option<candid::Nat>,)> {
    ic_cdk::call(self.0, "get_token_balance", (arg0,)).await
  }
  pub async fn get_token_balance_at_snapshot(&self, arg0: &String, arg1: &candid::Nat) -> Result<(Option<candid::Nat>,)> {
    ic_cdk::call(self.0, "get_token_balance_at_snapshot", (arg0,arg1,)).await
  }
  pub async fn is_feeder_agent(&self, arg0: &Principal) -> Result<(bool,)> {
    ic_cdk::call(self.0, "is_feeder_agent", (arg0,)).await
  }
  pub async fn new_snapshot(&self) -> Result<(Option<candid::Nat>,)> {
    ic_cdk::call(self.0, "new_snapshot", ()).await
  }
  pub async fn set_block_num(&self, arg0: &candid::Nat) -> Result<()> {
    ic_cdk::call(self.0, "set_block_num", (arg0,)).await
  }
  pub async fn set_token_balance(&self, arg0: &String, arg1: &candid::Nat) -> Result<()> {
    ic_cdk::call(self.0, "set_token_balance", (arg0,arg1,)).await
  }
}

