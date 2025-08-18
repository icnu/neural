use std::cell::RefCell;
use candid::Principal;
use ic_stable_structures::BTreeMap;
use crate::memory::{id_to_memory, Memory, MemoryIds};

thread_local! {
    static USER_IDENTITY: RefCell<BTreeMap<Principal, String, Memory>> = RefCell::new(BTreeMap::init(id_to_memory(MemoryIds::Identity)));
}

pub fn store_identity(caller: Principal, address: String) {
    USER_IDENTITY.with_borrow_mut(|map| map.insert(caller, address));
}

pub fn get_identity(caller: Principal) -> Option<String> {
    USER_IDENTITY.with_borrow(|map| map.get(&caller))
}