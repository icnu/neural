use std::cell::RefCell;
use candid::Principal;
use ic_stable_structures::storable::Blob;
use ic_vetkeys::encrypted_maps::{EncryptedMaps, VetKey, VetKeyVerificationKey};
use ic_vetkeys::types::{AccessRights, ByteBuf, EncryptedMapValue, TransportKey};
use ic_vetkeys::vetkd_api_types::{VetKDCurve, VetKDKeyId};
use crate::memory::{id_to_memory, MemoryIds};

thread_local! {
    static ENCRYPTED_MAPS: RefCell<Option<EncryptedMaps<AccessRights>>> =
        const { RefCell::new(None) };
}

const ENCRYPTED_MAPS_DOMAIN_SEPARATOR: &str = "neural_registry";

pub fn init(key_name: String) {
    let key_id = VetKDKeyId {
        curve: VetKDCurve::Bls12_381_G2,
        name: key_name,
    };
    ENCRYPTED_MAPS.with_borrow_mut(|encrypted_maps| {
        encrypted_maps.replace(EncryptedMaps::init(
            ENCRYPTED_MAPS_DOMAIN_SEPARATOR,
            key_id,
            id_to_memory(MemoryIds::EncryptedMapsDomainSeparator),
            id_to_memory(MemoryIds::EncryptedMapsAccessControl),
            id_to_memory(MemoryIds::EncryptedMapsSharedKeys),
            id_to_memory(MemoryIds::EncryptedMaps),
        ))
    });
}

pub fn get_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
) -> Result<Option<EncryptedMapValue>, String> {
    let map_name = bytebuf_to_blob(map_name)?;
    let map_id = (map_owner, map_name);
    ENCRYPTED_MAPS.with_borrow(|encrypted_maps| {
        encrypted_maps.as_ref().unwrap().get_encrypted_value(
            ic_cdk::api::caller(),
            map_id,
            bytebuf_to_blob(map_key)?,
        )
    })
}

pub fn insert_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
    value: EncryptedMapValue,
) -> Result<Option<EncryptedMapValue>, String> {
    let map_name = bytebuf_to_blob(map_name)?;
    let map_id = (map_owner, map_name);
    ENCRYPTED_MAPS.with_borrow_mut(|encrypted_maps| {
        encrypted_maps.as_mut().unwrap().insert_encrypted_value(
            ic_cdk::api::caller(),
            map_id,
            bytebuf_to_blob(map_key)?,
            value,
        )
    })
}

pub fn remove_encrypted_value(
    map_owner: Principal,
    map_name: ByteBuf,
    map_key: ByteBuf,
) -> Result<Option<EncryptedMapValue>, String> {
    let map_name = bytebuf_to_blob(map_name)?;
    let map_id = (map_owner, map_name);
    ENCRYPTED_MAPS.with_borrow_mut(|encrypted_maps| {
        encrypted_maps.as_mut().unwrap().remove_encrypted_value(
            ic_cdk::api::caller(),
            map_id,
            bytebuf_to_blob(map_key)?,
        )
    })
}

pub async fn get_vetkey_verification_key() -> VetKeyVerificationKey {
    ENCRYPTED_MAPS
        .with_borrow(|encrypted_maps| {
            encrypted_maps
                .as_ref()
                .unwrap()
                .get_vetkey_verification_key()
        })
        .await
}

pub async fn get_encrypted_vetkey(
    map_owner: Principal,
    map_name: ByteBuf,
    transport_key: TransportKey,
) -> Result<VetKey, String> {
    let map_name = bytebuf_to_blob(map_name)?;
    let map_id = (map_owner, map_name);
    Ok(ENCRYPTED_MAPS
        .with_borrow(|encrypted_maps| {
            encrypted_maps.as_ref().unwrap().get_encrypted_vetkey(
                ic_cdk::api::caller(),
                map_id,
                transport_key,
            )
        })?
        .await)
}

fn bytebuf_to_blob(buf: ByteBuf) -> Result<Blob<32>, String> {
    Blob::try_from(buf.as_ref()).map_err(|_| "too large input".to_string())
}
