use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{export_candid, init};

#[derive(Deserialize, CandidType)]
struct DaoInitArgs {
    id: u64,
    creator: Principal,
}

#[init]
fn init(args: DaoInitArgs) {

}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

export_candid!();