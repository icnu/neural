#!/bin/bash

function build_canister {
    local canister=$1
    local canister_wasm="target/wasm32-unknown-unknown/debug/$canister.wasm"
    local canister_did="src/$canister/canister.did"
    
    cargo build --target wasm32-unknown-unknown --package "$canister"
    candid-extractor "$canister_wasm" > "$canister_did"
}

function generate_bindings {
    didc bind -t rs $1 > $2
    sed -i '' 's/#!\[allow(dead_code, unused_imports)\]/#![allow(dead_code, unused_imports, deprecated)]/' $2
}

function build_canisters {
    for dir in src/*_canister/; do
        if [[ -d "$dir" ]]; then
            canister=$(basename "$dir")
            build_canister "$canister"
        fi
    done
}

build_canisters

generate_bindings src/common/candid/icp.did src/common/src/bindings/icp.rs
generate_bindings src/common/candid/siwe.did src/common/src/bindings/siwe.rs
generate_bindings src/dao_canister/canister.did src/common/src/bindings/dao_canister.rs
generate_bindings src/token_index_canister/canister.did src/common/src/bindings/token_index_canister.rs
generate_bindings src/hub_canister/canister.did src/common/src/bindings/hub_canister.rs
generate_bindings src/vote_canister/canister.did src/common/src/bindings/vote_canister.rs

build_canisters # run again with updated bindings