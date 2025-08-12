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
    EncryptedMapsDomainSeparator = 0,
    EncryptedMapsAccessControl = 1,
    EncryptedMapsSharedKeys = 2,
    EncryptedMaps = 3, 
    AccessControlList = 4,
    PlaintextMap = 5
}

pub fn id_to_memory(id: MemoryIds) -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(id as u8)))
}