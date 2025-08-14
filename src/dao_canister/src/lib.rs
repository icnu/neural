use ic_cdk::{export_candid, init, query};
use crate::metadata::{InitArgs, Metadata};

mod metadata;
mod memory;
mod execution;

#[init]
fn init(args: InitArgs) {
    metadata::init_metadata(args);
}

#[query]
fn get_metadata() -> Metadata {
    metadata::get_metadata()
}

export_candid!();