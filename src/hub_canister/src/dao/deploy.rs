use candid::{encode_one, Principal};
use common::bindings::dao_canister::InitArgs;
use ic_cdk::api::management_canister::main::{create_canister, install_code, CanisterInstallMode, CanisterSettings, CreateCanisterArgument, InstallCodeArgument};
use crate::wasm::get_dao_canister_wasm;

pub async fn deploy_dao_canister(id: u64, creator: Principal) -> Principal {
    let canister_id = create_canister(CreateCanisterArgument {
            settings: Some(CanisterSettings {
                controllers: Some(vec![creator, ic_cdk::id()]),
                compute_allocation: None,
                memory_allocation: None,
                freezing_threshold: None,
                reserved_cycles_limit: None,
                log_visibility: None,
                wasm_memory_limit: None,
            }),
        },
        5_000_000_000_000 // 5T
    ).await.unwrap().0.canister_id;

    install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: get_dao_canister_wasm(),
        arg: encode_one(InitArgs { id, creator }).unwrap()
    }).await.unwrap();

    canister_id
}