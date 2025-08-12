use std::borrow::Cow;
use candid::Principal;
use ic_stable_structures::{storable::Bound, Memory, Storable, Vec as StableVec};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct AccessControlNode {
    principal: Principal,
    access: u8
}

impl Storable for AccessControlNode {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let mut bytes: Vec<u8> = Vec::new();
        ciborium::into_writer(&self,&mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::from_reader(bytes.as_ref()).unwrap()
    }

    const BOUND: Bound = Bound::Bounded { max_size: 30, is_fixed_size: false };
}

pub struct AccessControlList<M: Memory> {
    list: StableVec<AccessControlNode, M>
}

impl<M: Memory> AccessControlList<M> {
    pub fn new(memory: M) -> Self {
        Self {
            list: StableVec::new(memory).unwrap()
        }
    }

    fn find_entry(&self, principal: Principal) -> Option<(AccessControlNode, u64)> {
        for (i, node) in self.list.iter().enumerate() {
            if node.principal == principal {
                return Some((node, i as u64));
            }
        }

        None
    }

    fn update_entry(&mut self, index: u64, entry: &AccessControlNode) {
        self.list.set(index, entry);
    }

    fn insert_entry(&mut self, entry: &AccessControlNode) {
        self.list.push(entry).unwrap();
    }

    pub fn is_authorized(&self, principal: Principal, access_mask: u8) -> bool {
        self.find_entry(principal)
            .and_then(|entry| {
                let (node, _) = entry;
                Some(node.access & access_mask == 0)
            })
            .or(Some(false))
            .unwrap()
    }

    pub fn set_is_authorized(&mut self, principal: Principal, access_mask: u8) {
        if let Some((mut node, i)) = self.find_entry(principal) {
            node.access = node.access | access_mask;
            self.update_entry(i, &node);
        } else {
            self.insert_entry(&AccessControlNode { principal, access: access_mask });
        }
    }
}
