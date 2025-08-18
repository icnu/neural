use candid::Principal;
use ic_cdk::{export_candid, query, update};
use crate::login::verify_signature;

mod memory;
mod login;
mod identity;

#[update]
fn get_login_message(user: String) -> String {
    login::generate_login_message(user)
}

#[update]
fn login(user: String, signature: String) {
    let verified = verify_signature(&user, &signature);
    if !verified { panic!("Invalid signature"); }

    identity::store_identity(ic_cdk::caller(), user);
}

#[query]
fn get_address(user: Principal) -> String {
    identity::get_identity(user).unwrap()
}

export_candid!();