use std::{borrow::Cow, cell::RefCell};

use candid::Principal;
use ic_stable_structures::{storable::Bound, Storable, Vec as StableVec};
use serde::{Deserialize, Serialize};
use crate::memory::{id_to_memory, Memory, MEMORY_ACCESS_CONTROL};

#[derive(Serialize, Deserialize, Debug)]
struct AccessControlNode {
    principal: Principal,
    acl: u8
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

thread_local! {
    static ACL_LIST: RefCell<StableVec<AccessControlNode, Memory>> = RefCell::new(StableVec::new(id_to_memory(MEMORY_ACCESS_CONTROL)).unwrap());
}

fn find_acl_node(user: Principal) -> Option<(AccessControlNode, u64)> {
    ACL_LIST.with_borrow(|acl_list| {
        for (i, node) in acl_list.iter().enumerate() {
            if node.principal == user {
                return Some((node, i as u64));
            }
        }

        None
    })
}

fn set_acl_node(index: u64, node: &AccessControlNode) {
    ACL_LIST.with_borrow_mut(|acl_list| {
        acl_list.set(index, node);
    })
}

fn push_acl_node(node: &AccessControlNode) {
    ACL_LIST.with_borrow_mut(|acl_list| {
        acl_list.push(&node).unwrap();
    })
}

pub const ACL_ENCRYPTED_DATA: u8 = 0x1;

pub fn is_authorized(user: Principal, acl_mask: u8) -> bool {
    find_acl_node(user)
        .and_then(|d| {
            let (node, _) = d;
            Some((node.acl & acl_mask) == 1)
        })
        .or(Some(false))
        .unwrap()
}

pub fn set_is_authorized(user: Principal, acl_mask: u8) {
    if let Some((mut node, i)) = find_acl_node(user) {
        node.acl = node.acl | acl_mask;
        set_acl_node(i, &node);
    } else {
        push_acl_node(&AccessControlNode {
            principal: user,
            acl: acl_mask
        });
    }
}
