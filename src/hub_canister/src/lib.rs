use candid::Principal;
use common::bindings::icp::Account;
use ic_cdk::{export_candid, query, update};
use crate::{guards::guard_caller_is_controller, stake::{get_payment_account, validate_account_balance}, wasm::Wasm};

mod dao;
mod memory;
mod guards;
mod wasm;
mod stake;

const STAKE_AMOUNT: u64 = 5_000_000_000;

#[update]
fn request_new_dao() -> Account {
    let caller = ic_cdk::api::msg_caller();
    let id = dao::request_new_dao(caller);
    let payment_account = get_payment_account(id);
    payment_account
}

#[update]
async fn complete_payment(id: u64) -> Principal {
    let result = validate_account_balance(id, STAKE_AMOUNT).await;
    if !result { panic!("Payment not completed yet"); }

    dao::request_dao_creation(id).await
}

#[update(guard="guard_caller_is_controller")]
fn set_dao_canister_wasm(wasm: Wasm) {
    wasm::set_dao_canister_wasm(wasm);
}

#[update(guard="guard_caller_is_controller")]
fn set_vote_canister_wasm(wasm: Wasm) {
    wasm::set_vote_canister_wasm(wasm);
}

#[query]
fn get_vote_canister_wasm() -> Wasm {
    wasm::get_vote_canister_wasm()
}

export_candid!();