use crate::access::{is_authorized, AccessMask};

pub fn guard_caller_is_controller() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    if !ic_cdk::api::is_controller(&caller) {
        Err("Caller not a controller, unauthorized".to_string())
    } else {
        Ok(())
    }
}

pub fn guard_caller_is_feeder() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    if !is_authorized(caller, AccessMask::Feeder) {
        Err("Caller is unauthorized".to_string())
    } else {
        Ok(())
    }
}
