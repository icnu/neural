use std::cell::RefCell;
use ic_stable_structures::{BTreeMap, Cell};
use crate::memory::{id_to_memory, Memory, MemoryIds};

thread_local! {
    static COUNTER: RefCell<Cell<u128, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::NonceCounter), 0).unwrap());
    static NONCE: RefCell<BTreeMap<String, String, Memory>> = RefCell::new(BTreeMap::init(id_to_memory(MemoryIds::Nonce)));
}

pub fn generate_user_nonce(user: &String) -> String {
    let time = ic_cdk::api::time() as u128;
    let counter = COUNTER.with_borrow(|cell| cell.get().clone());
    let nonce = (time * 1_0000) + (counter % 1_000);

    NONCE.with_borrow_mut(|map| map.insert(user.clone(), nonce.to_string()));
    nonce.to_string()
}

pub fn get_user_nonce(user: &String) -> Option<String> {
    NONCE.with_borrow(|map| map.get(&user))
}