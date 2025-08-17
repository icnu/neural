use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::{storable::Bound, Storable};

#[derive(CandidType, Deserialize, Clone)]
pub struct Metadata {
    pub id: u64,
    pub hub: Principal,
    pub name: Option<String>,
    pub logo: Option<String>,
    pub url: Option<String>,
    pub creator: Principal,
    pub token: Option<Principal>
}

impl Storable for Metadata {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode Metadata"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Metadata).expect("Failed to decode Metadata")
    }
    
    const BOUND: Bound = Bound::Bounded { max_size: 256, is_fixed_size: true };
}

#[derive(CandidType, Deserialize)]
pub struct InitArgs {
    id: u64,
    creator: Principal
}

impl Metadata {
    pub fn new(init_args: InitArgs, hub: Principal) -> Self {
        Self {
            id: init_args.id,
            hub,
            name: None,
            logo: None,
            url: None,
            creator: init_args.creator,
            token: None,
        }
    }

    pub fn default() -> Self {
        Self {
            id: 0,
            hub: Principal::anonymous(),
            name: None,
            logo: None,
            url: None,
            creator: Principal::anonymous(),
            token: None,
        }
    }
}