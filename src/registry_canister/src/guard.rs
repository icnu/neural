use crate::access::{self, is_authorized};

pub fn guard_caller_is_controller() -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    
    if !ic_cdk::api::is_controller(&caller) {
        Err("Caller not a controller, unauthorized".to_string())
    } else {
        Ok(())
    }
}

pub fn guard_caller_is_authorized() -> Result<(), String> {
    let caller = ic_cdk::api::msg_caller();
    
    if !is_authorized(caller, access::ACL_ENCRYPTED_DATA) {
        Err("Caller not authorized".to_string())
    } else {
        Ok(())
    }
}