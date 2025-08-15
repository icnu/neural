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
    Metadata = 0,
    Nonce = 1,
    ProposalsId = 2,
    Proposals = 3,
}

pub fn id_to_memory(id: MemoryIds) -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(id as u8)))
}