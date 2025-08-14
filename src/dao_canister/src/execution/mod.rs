use std::{cell::RefCell, str::FromStr};
use alloy::{network::{EthereumWallet, TransactionBuilder}, primitives::Address, providers::{Provider, ProviderBuilder}, rpc::types::TransactionRequest, signers::icp::IcpSigner, transports::icp::{EthSepoliaService, IcpConfig, RpcService}};
use candid::Principal;
use ic_stable_structures::Cell;
use serde_bytes::ByteBuf;
use crate::{execution::types::EthereumExecutionData, memory::{id_to_memory, Memory, MemoryIds}};

mod types;

thread_local! {
    static NONCE: RefCell<Cell<u128, Memory>> = RefCell::new(Cell::new(id_to_memory(MemoryIds::Nonce), 0).unwrap());
}

fn get_nonce() -> u128 {
    NONCE.with_borrow(|cell| cell.get().clone())
}

fn incr_nonce() {
    NONCE.with_borrow_mut(|cell| cell.set(cell.get() + 1).unwrap());
}

fn get_ecdsa_key_name() -> String {
    let dfx_network = option_env!("DFX_NETWORK").unwrap();
    match dfx_network {
        "local" => "dfx_test_key".to_string(),
        "ic" => "key_1".to_string(),
        _ => panic!("Unsupported network."),
    }
}

fn create_derivation_path(principal: &Principal) -> Vec<Vec<u8>> {
    const SCHEMA_V1: u8 = 1;
    [
        ByteBuf::from(vec![SCHEMA_V1]),
        ByteBuf::from(principal.as_slice().to_vec()),
    ]
    .iter()
    .map(|x| x.to_vec())
    .collect()
}

fn get_rpc_service() -> RpcService {
    RpcService::EthSepolia(EthSepoliaService::Alchemy)
}

pub async fn execute_txn(args: EthereumExecutionData) -> String {
    let to_address = Address::from_str(&args.to).unwrap();

    let ecdsa_key_name = get_ecdsa_key_name();
    let derivation_path = create_derivation_path(&ic_cdk::id());
    let signer = IcpSigner::new(derivation_path, &ecdsa_key_name, None).await.unwrap();

    let wallet = EthereumWallet::from(signer);
    let rpc_service = get_rpc_service();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new()
        .with_gas_estimation()
        .wallet(wallet)
        .on_icp(config);

    let nonce = get_nonce();
    let txn = TransactionRequest::default()
        .with_to(to_address)
        .with_gas_limit(args.gas_limit)
        .with_value(args.value.try_into().unwrap())
        .with_input(args.data)
        .with_nonce(nonce.try_into().unwrap());

    let result = provider.send_transaction(txn).await.unwrap();
    incr_nonce();

    result.tx_hash().to_string()
}