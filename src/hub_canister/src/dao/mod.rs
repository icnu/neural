use std::cell::RefCell;
use candid::Principal;
use ic_stable_structures::{BTreeMap, Cell};
use crate::{dao::{deploy::deploy_dao_canister, types::{DaoMetadata, DaoState}}, memory::{id_to_memory, Memory, MemoryIds}};

mod types;
mod deploy;

thread_local! {
    static DAO_ID: RefCell<Cell<u64, Memory>> = RefCell::new(Cell::init(id_to_memory(MemoryIds::DaoId), 1).unwrap());
    static DAO_STORE: RefCell<BTreeMap<u64, DaoMetadata, Memory>> = RefCell::new(BTreeMap::init(id_to_memory(MemoryIds::DaoMetadata)));
}

fn get_next_dao_id() -> u64 {
    DAO_ID.with_borrow(|cell| cell.get().clone())
}

fn increment_dao_id() {
    DAO_ID.with_borrow_mut(|cell| cell.set(cell.get() + 1).unwrap());
}

pub fn request_new_dao(creator: Principal) -> u64 {
    let dao_id = get_next_dao_id();

    DAO_STORE.with_borrow_mut(|map| {
        if map.contains_key(&dao_id) { panic!("Next DAO ID already populated!"); }

        map.insert(dao_id, DaoMetadata {
            id: dao_id,
            creator,
            state: DaoState::PendingPayment,
            canister: None
        })
    });

    increment_dao_id();
    dao_id
}

pub async fn request_dao_creation(id: u64) -> Principal {
    let mut metadata = DAO_STORE.with_borrow(|map| {
        if !map.contains_key(&id) { panic!("DAO ID doesn't exist"); }
        
        let Some(dao) = map.get(&id) else { panic!("DAO doesn't exist"); };
        if dao.state != DaoState::PendingPayment { panic!("DAO already in INIT state"); }

        dao
    });

    let canister_id = deploy_dao_canister(metadata.id, metadata.creator).await;
    metadata.state = DaoState::Init;
    metadata.canister = Some(canister_id);

    DAO_STORE.with_borrow_mut(|map| {
        map.insert(id, metadata);
    });

    canister_id
}