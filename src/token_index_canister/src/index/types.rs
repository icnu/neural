use std::borrow::Cow;
use candid::Principal;
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SnapshotMetadata {
    pub id: u8,
    pub block: u128,
    pub owner: Principal,
    pub being_used: bool
}

impl Storable for SnapshotMetadata {
    fn to_bytes(&self) -> Cow<'_, [u8]> {
        let mut bytes: Vec<u8> = Vec::new();
        ciborium::into_writer(&self,&mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::from_reader(bytes.as_ref()).unwrap()
    }

    const BOUND: Bound = Bound::Bounded { max_size: 128, is_fixed_size: false };
}
