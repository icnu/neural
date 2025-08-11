#!/bin/bash

function build_canister {
    local canister=$1
    local canister_wasm="target/wasm32-unknown-unknown/debug/$canister.wasm"
    local canister_did="src/$canister/canister.did"
    
    cargo build --target wasm32-unknown-unknown --package "$canister"
    candid-extractor "$canister_wasm" > "$canister_did"
}

for dir in src/*_canister/; do
    if [[ -d "$dir" ]]; then
        canister=$(basename "$dir")
        build_canister "$canister"
    fi
done