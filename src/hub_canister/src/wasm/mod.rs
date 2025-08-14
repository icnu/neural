use std::cell::RefCell;
use ic_stable_structures::Cell;

use crate::memory::{id_to_memory, Memory, MemoryIds};

pub type Wasm = Vec<u8>;

thread_local! {
    static DAO_CANISTER_WASM: RefCell<Cell<Wasm, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::DaoCanisterWasm), vec![]).unwrap());
    static VOTE_CANISTER_WASM: RefCell<Cell<Wasm, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::VoteCanisterWasm), vec![]).unwrap())
}

pub fn set_dao_canister_wasm(wasm: Wasm) {
    DAO_CANISTER_WASM.with_borrow_mut(|cell| cell.set(wasm).unwrap());
}

pub fn set_vote_canister_wasm(wasm: Wasm) {
    VOTE_CANISTER_WASM.with_borrow_mut(|cell| cell.set(wasm).unwrap());
}

pub fn get_dao_canister_wasm() -> Wasm {
    DAO_CANISTER_WASM.with_borrow(|cell| cell.get().clone())
}

pub fn get_vote_canister_wasm() -> Wasm {
    VOTE_CANISTER_WASM.with_borrow(|cell| cell.get().clone())
}