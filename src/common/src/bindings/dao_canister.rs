// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;

#[derive(CandidType, Deserialize)]
pub struct DaoInitArgs { pub id: u64, pub creator: Principal }

pub struct Service(pub Principal);
impl Service {
  pub async fn greet(&self, arg0: &String) -> Result<(String,)> {
    ic_cdk::call(self.0, "greet", (arg0,)).await
  }
}

