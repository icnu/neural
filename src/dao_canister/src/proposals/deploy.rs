use candid::{encode_one, Principal};
use common::bindings::{hub_canister::Service, vote_canister::InitArgs};
use ic_cdk::api::management_canister::main::{create_canister, install_code, CanisterInstallMode, CanisterSettings, CreateCanisterArgument, InstallCodeArgument};

use crate::metadata::get_metadata;

pub async fn deploy_vote_canister(init_args: InitArgs) -> Principal {
    let hub_canister = get_metadata().hub;
    let hub_service = Service(hub_canister);
    let vote_canister_wasm = hub_service.get_vote_canister_wasm().await.unwrap().0;

    let canister_id = create_canister(CreateCanisterArgument {
            settings: Some(CanisterSettings {
                controllers: Some(vec![ic_cdk::id()]),
                compute_allocation: None,
                memory_allocation: None,
                freezing_threshold: None,
                reserved_cycles_limit: None,
                log_visibility: None,
                wasm_memory_limit: None,
            }),
        },
        2_000_000_000_000 // 1T
    ).await.unwrap().0.canister_id;

    install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: vote_canister_wasm.into_vec(),
        arg: encode_one(init_args).unwrap()
    }).await.unwrap();

    canister_id
}