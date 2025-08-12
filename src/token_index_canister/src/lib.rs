use candid::{Principal};
use ic_cdk::{export_candid, query, update};
use crate::{access::{is_authorized, set_is_authorized, AccessMask}, guard::guard_caller_is_controller};

mod access;
mod memory;
mod guard;

#[update(guard = "guard_caller_is_controller")]
fn add_feeder_agent(principal: Principal) {
    set_is_authorized(principal, AccessMask::Feeder);
}

#[query]
fn is_feeder_agent(principal: Principal) -> bool {
    is_authorized(principal, AccessMask::Feeder)
}

export_candid!();