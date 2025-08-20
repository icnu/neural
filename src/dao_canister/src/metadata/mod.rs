use std::cell::RefCell;
use candid::Principal;
use ic_stable_structures::Cell;
pub use types::{Metadata, InitArgs, MetadataUpdate};
use crate::{memory::{id_to_memory, Memory, MemoryIds}};

mod types;

thread_local! {
    static METADATA: RefCell<Cell<Metadata, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::Metadata), Metadata::default()).unwrap());
}

pub fn init_metadata(args: InitArgs, hub: Principal) {
    METADATA.with_borrow_mut(|cell| cell.set(Metadata::new(args, hub)).unwrap());
}

pub fn update_metadata(args: MetadataUpdate) {
    METADATA.with_borrow_mut(|cell| {
        let mut metadata = cell.get().clone();
        metadata.populate(args);
        cell.set(metadata).unwrap();
    });
}

pub fn get_metadata() -> Metadata {
    METADATA.with_borrow(|cell| cell.get().clone())
}