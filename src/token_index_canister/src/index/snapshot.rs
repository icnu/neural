use std::collections::HashMap;

use candid::Principal;
use ic_stable_structures::BTreeMap;
use crate::{index::types::SnapshotMetadata, memory::{id_with_incr_to_memory, Memory, MemoryIds}};

type SnapshotId = u128;
type SnapshotIndex = u8;
type Balance = u128;
type Address = String;

pub struct SnapshotManager {
    metadata_store: BTreeMap<SnapshotId, SnapshotMetadata, Memory>,
    snapshot_stores: Vec<BTreeMap<Address, Balance, Memory>>,
    snapshot_index_to_id: HashMap<SnapshotIndex, SnapshotId>,
    ordered_snapshot_indices: Vec<SnapshotIndex>,
    free_snapshot_stores_mask: u64,
    num_snapshots: u8,
    next_snapshot_id: u128,
    init: bool
}

impl SnapshotManager {
    pub fn new(metadata_memory: Memory, start_memory_id: MemoryIds, num_snapshots: u8) -> Self {
        if num_snapshots > 64 { panic!("We only support upto 64 snapshots"); } // depends on size of free mask

        let metadata_store = BTreeMap::new(metadata_memory);
        let mut snapshots = Vec::new();
        for i in 0..num_snapshots {
            snapshots.push(BTreeMap::new(id_with_incr_to_memory(start_memory_id, i)));
        }

        Self {
            metadata_store,
            snapshot_stores: snapshots,
            snapshot_index_to_id: HashMap::new(),
            ordered_snapshot_indices: Vec::new(),
            free_snapshot_stores_mask: (1 << (num_snapshots + 1)) - 1,
            num_snapshots,
            next_snapshot_id: 1,
            init: false
        }
    }

    fn recalculate_cache(&mut self) {
        self.next_snapshot_id = 1;
        self.free_snapshot_stores_mask = (1 << (self.num_snapshots + 1)) - 1;
        self.snapshot_index_to_id = HashMap::new();

        let mut snapshot_ids_and_blocks = Vec::new();
        for (id, metadata) in self.metadata_store.iter() {
            if metadata.being_used {
                snapshot_ids_and_blocks.push((metadata.id, metadata.block));
                self.snapshot_index_to_id.insert(metadata.id, id);
                
                if id > self.next_snapshot_id { self.next_snapshot_id = id + 1; }
                self.free_snapshot_stores_mask &= !(1 << metadata.id);
            }
        }

        snapshot_ids_and_blocks.sort_by_key(|a| a.1);
        self.ordered_snapshot_indices = snapshot_ids_and_blocks.into_iter().map(|a| a.0).collect();
        self.init = true;
    }

    pub fn new_snapshot(&mut self, block: u128, owner: Principal) -> Option<SnapshotId> {
        if !self.init { self.recalculate_cache(); }

        let mut free_index = None;
        for i in 0..self.num_snapshots {
            if self.free_snapshot_stores_mask & (1 << i) > 0 {
                free_index = Some(i);
            }
        }
        
        if free_index.is_none() { return None; }
        let free_index = free_index.unwrap();
        
        self.metadata_store.insert(self.next_snapshot_id, SnapshotMetadata {
            id: free_index,
            block,
            owner,
            being_used: true
        });

        self.next_snapshot_id += 1;
        self.snapshot_stores[free_index as usize].clear_new();
        self.recalculate_cache();

        Some(self.next_snapshot_id - 1)
    }

    pub fn delete_snapshot(&mut self, id: u128, caller: Principal) {
        if !self.init { self.recalculate_cache(); }
        
        let metadata = self.metadata_store.get(&id);
        if metadata.is_none() { panic!("Trying to delete invalid snapshot"); }
        
        let metadata = metadata.unwrap();
        if metadata.owner != caller { panic!("Unauthorized attempt to delete snapshots"); }

        self.metadata_store.remove(&id);
        self.recalculate_cache();
    }

    pub fn set_value(&mut self, key: Address, value: Balance) {
        for snapshot in self.snapshot_stores.iter_mut().rev() {
            if snapshot.contains_key(&key) {
                break;
            } else {
                snapshot.insert(key.clone(), value);
            }
        }
    }

    pub fn get_value(&self, key: &Address, snapshot_id: SnapshotId) -> Option<Balance> {
        let metadata = self.metadata_store.get(&snapshot_id);
        if metadata.is_none() { return None; }

        let metadata = metadata.unwrap();
        let snapshot_index = metadata.id;
        
        self.snapshot_stores[snapshot_index as usize].get(&key)
    }
}