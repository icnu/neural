import { Governance } from './governance';
import { Token } from './token';
import { ButtonInteraction, ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, StringSelectMenuInteraction } from "discord.js";

export type CommandHandlerType = (interaction: ChatInputCommandInteraction) => Promise<void>;
export type ButtonHandlerType = (interaction: ButtonInteraction) => Promise<void>;
export type StringSelectHandlerType = (interaction: StringSelectMenuInteraction) => Promise<void>;

export type RegisterSlashCommand = {
    command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    handler: CommandHandlerType,
};

export type RegisterButton = {
    id: string,
    handler: ButtonHandlerType
}

export type RegisterStringSelect = {
    id: string,
    handler: StringSelectHandlerType
}

let _commands: RegisterSlashCommand[] = [
    ...Token.commands,
    ...Governance.commands
];
let _buttons: RegisterButton[] = [
    ...Token.buttons,
    ...Governance.buttons
];
let _stringSelects: RegisterStringSelect[] = [
    ...Governance.stringSelects
]
let _commandNameToHandlerIndex = new Map<string, CommandHandlerType>();
let _buttonNameToHandlerIndex = new Map<string, ButtonHandlerType>();
let _stringSelectNameToHandlerIndex = new Map<string, StringSelectHandlerType>();

export async function registerCommands(client: Client) {
    _commands.forEach(command => {
        _commandNameToHandlerIndex.set(command.command.name, command.handler);
    });

    _buttons.forEach(button => {
        _buttonNameToHandlerIndex.set(button.id, button.handler);
    })

    _stringSelects.forEach(select => {
        _stringSelectNameToHandlerIndex.set(select.id, select.handler);
    })

    const promises = _commands.map(async command => {
        await client.application?.commands.create(command.command.toJSON());
    });

    await Promise.all(promises);
}

export async function handlerCommandInteraction(interaction: Interaction) {
    if ( interaction.isChatInputCommand() ) {
        const handler = _commandNameToHandlerIndex.get(interaction.commandName);
        if ( handler ) await handler(interaction);
    } else if ( interaction.isButton() ) {
        const handler = _buttonNameToHandlerIndex.get(interaction.customId.split(':')[0]);
        if ( handler ) await handler(interaction);
    } else if ( interaction.isStringSelectMenu() ) {
        const handler = _stringSelectNameToHandlerIndex.get(interaction.customId.split(':')[0]);
        if ( handler ) await handler(interaction);
    }
}