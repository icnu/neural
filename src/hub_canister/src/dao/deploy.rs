use candid::{encode_one, Principal};
use common::bindings::dao_canister::InitArgs;
use ic_cdk::management_canister::{self, CanisterInstallMode, CanisterSettings, CreateCanisterArgs, InstallCodeArgs};
use crate::wasm::get_dao_canister_wasm;

pub async fn deploy_dao_canister(id: u64, creator: Principal) -> Principal {
    let canister_id = management_canister::create_canister_with_extra_cycles(&CreateCanisterArgs {
            settings: Some(CanisterSettings {
                controllers: Some(vec![creator, ic_cdk::api::canister_self()]),
                compute_allocation: None,
                memory_allocation: None,
                freezing_threshold: None,
                reserved_cycles_limit: None,
                log_visibility: None,
                wasm_memory_limit: None,
                wasm_memory_threshold: None,
            }),
        },
        20_000_000_000 // 20B
    ).await.unwrap().canister_id;

    management_canister::install_code(&InstallCodeArgs {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: get_dao_canister_wasm(),
        arg: encode_one(InitArgs { id, creator }).unwrap()
    }).await.unwrap();

    canister_id
}