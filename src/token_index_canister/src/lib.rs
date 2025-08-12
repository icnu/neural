use candid::{Principal};
use ic_cdk::{export_candid, query, update};
use crate::{access::{is_authorized, set_is_authorized, AccessMask}, guard::{guard_caller_is_controller, guard_caller_is_feeder}, index::{get_balance, set_balance}};

mod access;
mod memory;
mod guard;
mod index;

#[update(guard = "guard_caller_is_feeder")]
fn set_token_balance(user: Vec<u8>, balance: u128) {
    set_balance(user, balance);
}

#[query]
fn get_token_balance(user: Vec<u8>) -> Option<u128> {
    get_balance(user)
}

#[update(guard = "guard_caller_is_controller")]
fn add_feeder_agent(principal: Principal) {
    set_is_authorized(principal, AccessMask::Feeder);
}

#[query]
fn is_feeder_agent(principal: Principal) -> bool {
    is_authorized(principal, AccessMask::Feeder)
}

export_candid!();