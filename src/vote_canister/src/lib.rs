use candid::{CandidType, Principal};
use ic_cdk::{export_candid, init};
use serde::Deserialize;

#[derive(CandidType, Deserialize)]
struct InitArgs {
    proposal_id: u64,
    token_canister: Principal,
    dao_canister: Principal,
    snapshot_id: u64,
}

#[init]
fn init(args: InitArgs) {

}

export_candid!();