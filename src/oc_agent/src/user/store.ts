import { Principal } from "@dfinity/principal";
import { get_encrypted_maps } from "../encrypted_maps";
import { Snowflake, User } from "discord.js";
import { loadIdentity } from "../utils";

export type UserData = {
    private_key_data: string,
    delegation_data: string,
    principal: string,
    discord_id: Snowflake
};

const _mapOwner = loadIdentity().getPrincipal();
const _mapName = new TextEncoder().encode("user_data");

export class UserStoreClass {
    async store(user_data: UserData) {
        await get_encrypted_maps().setValue(
            _mapOwner,
            _mapName,
            new TextEncoder().encode(user_data.discord_id),
            new TextEncoder().encode(JSON.stringify(user_data))
        );
    }

    async get(discord_id: Snowflake): Promise<UserData | undefined> {
        const rawValue = await get_encrypted_maps().getValue(
            _mapOwner,
            _mapName,
            new TextEncoder().encode(discord_id),
        );
        if ( rawValue.length == 0 ) return;

        const decodedValue = new TextDecoder().decode(rawValue);
        const parsedValue = JSON.parse(decodedValue) as UserData;
        return parsedValue;
    }

    async users(): Promise<UserData[]> {
        const values = await get_encrypted_maps().getValuesForMap(
            _mapOwner,
            _mapName
        );

        return values.map(v => {
            const json = new TextDecoder().decode(v[1]);
            const parsed = JSON.parse(json) as UserData;
            return parsed;
        });
    }
}

export const UserStore = new UserStoreClass();