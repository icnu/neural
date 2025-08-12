use std::cell::RefCell;
use ic_stable_structures::BTreeMap;
use ic_vetkeys::types::ByteBuf;
use crate::memory::{id_to_memory, Memory, MemoryIds};

thread_local! {
    static PLAINTEXT_MAP: RefCell<BTreeMap<ByteBuf, ByteBuf, Memory>> = RefCell::new(BTreeMap::new(id_to_memory(MemoryIds::PlaintextMap)));
}

pub fn insert_plaintext_value(key: ByteBuf, value: ByteBuf) -> Option<ByteBuf> {
    PLAINTEXT_MAP.with_borrow_mut(|map| {
        map.insert(key, value)
    })
}

pub fn get_plaintext_value(key: ByteBuf) -> Option<ByteBuf> {
    PLAINTEXT_MAP.with_borrow(|map| {
        map.get(&key)
    })
}

pub fn remove_plaintext_value(key: ByteBuf) -> Option<ByteBuf> {
    PLAINTEXT_MAP.with_borrow_mut(|map| {
        map.remove(&key)
    })
}