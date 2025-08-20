source .env

dfx deploy hub_canister;
export CANISTER_ID_HUB_CANISTER=$(dfx canister id hub_canister)
dfx ledger fabricate-cycles --canister $CANISTER_ID_HUB_CANISTER --cycles 100_000_000_000_000

dfx build --check dao_canister
dfx build --check vote_canister

gzip -f -1 target/wasm32-unknown-unknown/release/dao_canister.wasm
gzip -f -1 target/wasm32-unknown-unknown/release/vote_canister.wasm

cd src/utils
npx tsx ./src/setup_hub.ts