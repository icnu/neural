use std::cell::RefCell;
use candid::Principal;
use common::acl::AccessControlList;
use crate::memory::{id_to_memory, Memory, MEMORY_ACCESS_CONTROL};

thread_local! {
    static ACL: RefCell<AccessControlList<Memory>> = RefCell::new(AccessControlList::new(id_to_memory(MEMORY_ACCESS_CONTROL)));
}

pub const ACCESS_MASK_ENCRYPTED_DATA: u8 = 0x1;

pub fn is_authorized(principal: Principal, access_mask: u8) -> bool {
    ACL.with_borrow(|acl| acl.is_authorized(principal, access_mask))
}

pub fn set_is_authorized(principal: Principal, access_mask: u8) {
    ACL.with_borrow_mut(|acl| acl.set_is_authorized(principal, access_mask))
}
