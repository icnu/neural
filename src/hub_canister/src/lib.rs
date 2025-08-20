use candid::Principal;
use common::bindings::icp::Account;
use ic_cdk::{export_candid, query, update};
use crate::{guards::guard_caller_is_controller, stake::{get_payment_account, validate_account_balance}, wasm::Wasm};

mod dao;
mod memory;
mod guards;
mod wasm;
mod stake;

const STAKE_AMOUNT: u64 = 0;

#[update]
fn request_new_dao() -> Account {
    let caller = ic_cdk::api::caller();
    let id = dao::request_new_dao(caller);
    let payment_account = get_payment_account(id);
    payment_account
}

#[update]
async fn complete_payment(id: u64) -> Principal {
    // let result = validate_account_balance(id, STAKE_AMOUNT).await;
    // if !result { panic!("Payment not completed yet"); }

    dao::request_dao_creation(id).await
}

#[update]
fn set_dao_canister_wasm(wasm: Wasm) {
    wasm::set_dao_canister_wasm(wasm);
}

#[update]
fn set_vote_canister_wasm(wasm: Wasm) {
    wasm::set_vote_canister_wasm(wasm);
}

#[query]
fn get_vote_canister_wasm() -> Wasm {
    wasm::get_vote_canister_wasm()
}

#[query]
fn list_daos() -> Vec<Principal> {
    dao::list_daos()
}

export_candid!();