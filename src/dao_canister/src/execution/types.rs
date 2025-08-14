use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{storable::Bound, Storable};

#[derive(CandidType, Deserialize)]
pub struct EthereumExecutionData {
    pub to: String,
    pub value: u128,
    pub gas_limit: u128,
    pub chain_id: u128,
    pub data: Vec<u8>    
}

impl Storable for EthereumExecutionData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).expect("Failed to encode EthereumExecutionData"))
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), EthereumExecutionData).expect("Failed to decode EthereumExecutionData")
    }
    
    const BOUND: Bound = Bound::Unbounded;
}
