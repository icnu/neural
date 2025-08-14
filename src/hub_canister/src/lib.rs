use ic_cdk::{export_candid, query, update};
use crate::{guards::guard_caller_is_controller, wasm::Wasm};

mod memory;
mod guards;
mod wasm;
mod stake;

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