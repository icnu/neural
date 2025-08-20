use ic_cdk::{export_candid, init, query, update};
use crate::{guards::guard_caller_is_controller, metadata::{InitArgs, Metadata, MetadataUpdate}, proposals::types::{Proposal, ProposalMetadata, ProposalVerdict}};

mod metadata;
mod memory;
mod execution;
mod proposals;
mod guards;

#[init]
fn init(args: InitArgs) {
    metadata::init_metadata(args, ic_cdk::caller());
}

#[update]
fn update_metadata(args: MetadataUpdate) {
    metadata::update_metadata(args);
}

#[update(guard = "guard_caller_is_controller")]
async fn request_new_proposal(metadata: ProposalMetadata) -> u64 {
    proposals::request_new_proposal(metadata, ic_cdk::caller()).await
}

#[update]
async fn request_proposal_voting_close(id: u64, verdict: ProposalVerdict) {
    if ic_cdk::caller() != proposals::get_proposal(id).unwrap().vote_canister.unwrap() { panic!("Unauthorized"); }
    proposals::request_proposal_voting_close(id, verdict).await;
}

#[query]
async fn get_proposal(id: u64) -> Option<Proposal> {
    proposals::get_proposal(id)
}

#[query]
fn get_metadata() -> Metadata {
    metadata::get_metadata()
}

export_candid!();