use candid::{Principal};
use ic_cdk::{export_candid, query, update};
use crate::{access::{is_authorized, set_is_authorized, AccessMask}, guard::{guard_caller_is_controller, guard_caller_is_feeder}, index::{get_balance, get_balance_at_snapshot, set_balance}};

mod access;
mod memory;
mod guard;
mod index;

#[update]
fn new_snapshot() -> Option<u128> {
    index::new_snapshot(ic_cdk::api::caller())
}

#[update]
fn delete_snapshot(snapshot: u128) {
    index::delete_snapshot(snapshot, ic_cdk::api::caller());
}

#[update(guard = "guard_caller_is_feeder")]
fn set_token_balance(user: Vec<u8>, balance: u128) {
    set_balance(user, balance);
}

#[update(guard = "guard_caller_is_feeder")]
fn set_block_num(block_num: u128) {
    index::set_block_num(block_num);
}

#[query]
fn get_token_balance(user: Vec<u8>) -> Option<u128> {
    get_balance(user)
}

#[query]
fn get_token_balance_at_snapshot(user: Vec<u8>, snapshot: u128) -> Option<u128> {
    get_balance_at_snapshot(user, snapshot)
}

#[query]
fn get_block_num() -> u128 {
    index::get_block_num()
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