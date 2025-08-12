use std::cell::RefCell;
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, DefaultMemoryImpl};

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

#[derive(Copy, Clone, Debug)]
#[repr(u8)]
pub enum MemoryIds {
    AccessControlList = 0,
    TokenBlock = 1,
    TokenIndex = 2,
    SnapshotMetadata = 3,
    SnapshotStores = 4
}

pub fn id_to_memory(id: MemoryIds) -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(id as u8)))
}

pub fn id_with_incr_to_memory(id: MemoryIds, incr: u8) -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new((id as u8) + incr)))
}