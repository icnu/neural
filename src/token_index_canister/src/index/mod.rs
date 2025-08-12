use std::cell::RefCell;
use candid::Principal;
use ic_stable_structures::{BTreeMap, Cell};
use crate::{index::snapshot::SnapshotManager, memory::{id_to_memory, Memory, MemoryIds}};

mod snapshot;
mod types;

const NUM_SNAPSHOTS: u8 = 10;

thread_local! {
    static BLOCK_NUM: RefCell<Cell<u128, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::TokenBlock), 0).unwrap());
    static INDEX: RefCell<BTreeMap<Vec<u8>, u128, Memory>> = RefCell::new(BTreeMap::new(id_to_memory(MemoryIds::TokenIndex)));
    static SNAPSHOT: RefCell<SnapshotManager> = RefCell::new(SnapshotManager::new(
        id_to_memory(MemoryIds::SnapshotMetadata),
        MemoryIds::SnapshotStores,
        NUM_SNAPSHOTS
    ))
}

pub fn new_snapshot(owner: Principal) -> Option<u128> {
    let block = get_block_num();
    SNAPSHOT.with_borrow_mut(|manager| manager.new_snapshot(block, owner))
}

pub fn delete_snapshot(id: u128, caller: Principal) {
    SNAPSHOT.with_borrow_mut(|manager| manager.delete_snapshot(id, caller));
}

pub fn get_balance(user: Vec<u8>) -> Option<u128> {
    INDEX.with_borrow(|index| {
        index.get(&user)
    })
}

pub fn get_balance_at_snapshot(user: Vec<u8>, snapshot: u128) -> Option<u128> {
    let snapshot_value = SNAPSHOT.with_borrow(|manager| manager.get_value(&user, snapshot));
    
    if snapshot_value.is_some() { return snapshot_value; }
    get_balance(user)
}

pub fn get_block_num() -> u128 {
    BLOCK_NUM.with_borrow(|cell| cell.get().clone())
}

pub fn set_balance(user: Vec<u8>, balance: u128) -> Option<u128> {
    INDEX.with_borrow_mut(|index| {
        SNAPSHOT.with_borrow_mut(|manager| manager.set_value(user.clone(), balance));
        index.insert(user, balance)
    })
}

pub fn set_block_num(block_num: u128) {
    BLOCK_NUM.with_borrow_mut(|cell| cell.set(block_num).unwrap());
}