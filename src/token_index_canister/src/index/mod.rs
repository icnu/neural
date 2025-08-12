use std::cell::RefCell;
use ic_stable_structures::BTreeMap;
use crate::memory::{id_to_memory, Memory, MemoryIds};

thread_local! {
    static INDEX: RefCell<BTreeMap<Vec<u8>, u128, Memory>> = RefCell::new(BTreeMap::new(id_to_memory(MemoryIds::TokenIndex)))
}

pub fn get_balance(user: Vec<u8>) -> Option<u128> {
    INDEX.with_borrow(|index| {
        index.get(&user)
    })
}

pub fn set_balance(user: Vec<u8>, balance: u128) -> Option<u128> {
    INDEX.with_borrow_mut(|index| {
        index.insert(user, balance)
    })
}