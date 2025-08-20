// send-viem.ts
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, localhost } from "viem/chains";

const PRIVATE_KEY = "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd";
const TO = "0xDEF423fd3975C2370Eba011FB55bf2919395763b";

async function main() {
    const account = privateKeyToAccount(PRIVATE_KEY);
    const client = createWalletClient({
        account,
        chain: hardhat,
        transport: http("http://127.0.0.1:8545"),
    });

    const hash = await client.sendTransaction({
        to: TO,
        value: parseEther("1"),
    });

    console.log("tx hash:", hash);
}

main();
