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
  pub url: Option<String>,
  pub creator: Principal,
  pub token: Option<Principal>,
  pub logo: Option<String>,
  pub name: Option<String>,
}

pub struct Service(pub Principal);
impl Service {
  pub async fn get_metadata(&self) -> Result<(Metadata,)> {
    ic_cdk::call(self.0, "get_metadata", ()).await
  }
}

