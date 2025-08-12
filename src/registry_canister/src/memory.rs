use std::cell::RefCell;
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, DefaultMemoryImpl};

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

pub fn id_to_memory(id: u8) -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(id)))
}

pub const MEMORY_ENCRYPTED_MAPS_DOMAIN_SEPARATOR: u8 = 0;
pub const MEMORY_ENCRYPTED_MAPS_ACCESS_CONTROL: u8 = 1;
pub const MEMORY_ENCRYPTED_MAPS_SHARED_KEYS: u8 = 3;
pub const MEMORY_ENCRYPTED_MAPS: u8 = 4;
pub const MEMORY_ACCESS_CONTROL: u8 = 5;