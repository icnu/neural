import { PathOrFileDescriptor, readFileSync } from "fs";
import { createActor } from "./declarations/hub_canister";
import { cwd } from "process";

function loadWasm(path: PathOrFileDescriptor): Uint8Array {
    const data: Uint8Array = readFileSync(path);
    return data;
}

async function main() {
    const actor = createActor(process.env.CANISTER_ID_HUB_CANISTER!, {
        agentOptions: { host: 'http://localhost:4943' }
    });
    console.log(cwd());
    await actor.set_dao_canister_wasm(loadWasm("../../target/wasm32-unknown-unknown/release/dao_canister.wasm.gz"));
    await actor.set_vote_canister_wasm(loadWasm("../../target/wasm32-unknown-unknown/release/vote_canister.wasm.gz"));
}

main();