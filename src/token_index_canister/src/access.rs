use std::cell::RefCell;
use candid::Principal;
use common::acl::AccessControlList;
use crate::memory::{id_to_memory, Memory, MEMORY_ACCESS_CONTROL};

thread_local! {
    static ACL: RefCell<AccessControlList<Memory>> = RefCell::new(AccessControlList::new(id_to_memory(MEMORY_ACCESS_CONTROL)));
}

#[derive(Clone, Copy, Debug)]
#[repr(u8)]
pub enum AccessMask {
    EncryptedData = 0x1
}

pub fn is_authorized(principal: Principal, access_mask: AccessMask) -> bool {
    ACL.with_borrow(|acl| acl.is_authorized(principal, access_mask as u8))
}

pub fn set_is_authorized(principal: Principal, access_mask: AccessMask) {
    ACL.with_borrow_mut(|acl| acl.set_is_authorized(principal, access_mask as u8))
}
