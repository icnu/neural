use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq)]
pub enum DaoState {
    PendingPayment,
    Init,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct DaoMetadata {
    pub id: u64,
    pub creator: Principal,
    pub state: DaoState,
    pub canister: Option<Principal>,
}

impl Storable for DaoMetadata {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode DaoMetadata"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), DaoMetadata).expect("Failed to decode DaoMetadata")
    }
    
    const BOUND: Bound = Bound::Bounded { max_size: 128, is_fixed_size: false };
}

impl Storable for DaoState {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode DaoState"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), DaoState).expect("Failed to decode DaoState")
    }
    
    const BOUND: Bound = Bound::Bounded { max_size: 16, is_fixed_size: false };
}

