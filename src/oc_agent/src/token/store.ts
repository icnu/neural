import { Principal } from "@dfinity/principal";
import { get_encrypted_maps } from "../encrypted_maps";
import { Snowflake } from "discord.js";
import { loadIdentity } from "../utils";

const _mapOwner = loadIdentity().getPrincipal();
const _mapName = new TextEncoder().encode("user_tokens");

export type TokenData = {
    token_id: string,
    discord_id: Snowflake
};

export class TokenStoreClass {
    async store(token_data: TokenData) {
        await get_encrypted_maps().setValue(
            _mapOwner,
            _mapName,
            new TextEncoder().encode(token_data.token_id),
            new TextEncoder().encode(JSON.stringify(token_data))
        );
    }

    async get(token_id: string): Promise<TokenData | null> {
        const storedRaw = await get_encrypted_maps().getValue(
            _mapOwner,
            _mapName,
            new TextEncoder().encode(token_id)
        );
        if (storedRaw.length == 0) return null;

        const storedText = new TextDecoder().decode(storedRaw);
        return JSON.parse(storedText) as TokenData;
    }
}

export const TokenStore = new TokenStoreClass();