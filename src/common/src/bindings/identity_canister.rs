// This is an experimental feature to generate Rust binding from Candid.
// You may want to manually adjust some of the types.
#![allow(dead_code, unused_imports, deprecated)]
use candid::{self, CandidType, Deserialize, Principal};
use ic_cdk::api::call::CallResult as Result;


pub struct Service(pub Principal);
impl Service {
  pub async fn get_address(&self, arg0: &Principal) -> Result<(String,)> {
    ic_cdk::call(self.0, "get_address", (arg0,)).await
  }
  pub async fn get_login_message(&self, arg0: &String) -> Result<(String,)> {
    ic_cdk::call(self.0, "get_login_message", (arg0,)).await
  }
  pub async fn login(&self, arg0: &String, arg1: &String) -> Result<()> {
    ic_cdk::call(self.0, "login", (arg0,arg1,)).await
  }
}

