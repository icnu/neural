use candid::Principal;
use ic_cdk::{query, update};

#[update]
fn prepare_login(address: String) -> String {
    todo!()
}

#[update]
fn login(address: String, signature: String) {
    todo!()
}

#[query]
fn get_address(user: Principal) -> String {
    todo!()
}