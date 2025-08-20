use candid::Nat;
use common::bindings::dao_canister::ProposalVerdict;
use ic_cdk::{export_candid, init, query, update};
use crate::vote::types::{InitArgs, VoteMetadata};

mod vote;
mod memory;
mod strategy;

#[init]
fn init(args: InitArgs) {
    vote::init(args);
}

#[query]
fn get_metadata() -> VoteMetadata {
    vote::get_metadata()
}

#[update]
async fn cast_vote(vote: ProposalVerdict) {
    vote::cast_vote(ic_cdk::caller(), vote).await;
}

#[update]
async fn close_vote() {
    vote::close_vote().await;
}

#[query]
async fn has_cast_vote(user: String) -> bool {
    vote::has_cast_vote(user).await
}

export_candid!();