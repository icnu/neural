use candid::Principal;
use ic_cdk::{export_candid, query, update};
use ic_vetkeys::{encrypted_maps::{VetKey, VetKeyVerificationKey}, types::{ByteBuf, EncryptedMapValue, TransportKey}};
use crate::{access::{is_authorized, set_is_authorized, ACL_ENCRYPTED_DATA}, guard::{guard_caller_is_authorized, guard_caller_is_controller}};

mod memory;
mod access;
mod guard;
mod encrypted;

#[update(guard = "guard_caller_is_authorized")]
fn get_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
) -> Result<Option<EncryptedMapValue>, String> {
    encrypted::get_encrypted_value(map_owner, map_name, map_key)
}

#[update(guard = "guard_caller_is_authorized")]
fn insert_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
    value: EncryptedMapValue,
) -> Result<Option<EncryptedMapValue>, String> {
    encrypted::insert_encrypted_value(map_owner, map_name, map_key, value)
}

#[update(guard = "guard_caller_is_authorized")]
fn remove_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
) -> Result<Option<EncryptedMapValue>, String> {
    encrypted::remove_encrypted_value(map_owner, map_name, map_key)
}

#[update(guard = "guard_caller_is_authorized")]
async fn get_vetkey_verification_key() -> VetKeyVerificationKey {
    encrypted::get_vetkey_verification_key().await
}

#[update(guard = "guard_caller_is_authorized")]
async fn get_encrypted_vetkey(
    map_owner: Principal,
    map_name: ByteBuf,
    transport_key: TransportKey,
) -> Result<VetKey, String> {
    encrypted::get_encrypted_vetkey(map_owner, map_name, transport_key).await
}

#[update(guard = "guard_caller_is_controller")]
fn authorize_agent(principal: Principal) {
    set_is_authorized(principal, ACL_ENCRYPTED_DATA);
}

#[query]
fn is_authorized_agent(principal: Principal) -> bool {
    is_authorized(principal, ACL_ENCRYPTED_DATA)
}

export_candid!();