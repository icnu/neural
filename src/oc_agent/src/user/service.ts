import { Snowflake } from "discord.js";
import { UserData, UserStore } from "./store";
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity, isDelegationValid } from "@dfinity/identity";

export type StoreUserDataDTO = {
    private_key_data: string,
    delegation_data: string,
    principal: string,
}

export class UserServiceClass {
    async store_user_details(discord_id: Snowflake, data: StoreUserDataDTO) {
        await UserStore.store({
            ...data,
            discord_id
        });
    }

    async list_all_users(): Promise<UserData[]> {
        return await UserStore.users();
    }

    async get_user_identity(discord_id: Snowflake): Promise<DelegationIdentity | undefined> {
        const user_data = await UserStore.get(discord_id);
        if (!user_data) return;

        const delegationChain = DelegationChain.fromJSON(user_data.delegation_data);
        if (!isDelegationValid(delegationChain)) return;

        const keyIdentity = Ed25519KeyIdentity.fromJSON(user_data.private_key_data);
        const idenity = DelegationIdentity.fromDelegation(keyIdentity, delegationChain);
        return idenity;
    }
}

export const UserService = new UserServiceClass();