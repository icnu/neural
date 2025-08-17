import { ApplicationEmojiCreateOptions, Client, Emoji } from "discord.js";

const _emojiMetadata: ApplicationEmojiCreateOptions[] = [
    {
        name: 'neuronGreenLine',
        attachment: 'https://cdn3.emoji.gg/emojis/4860-linegreen.png'
    },
    {
        name: 'neuronRedLine',
        attachment: 'https://cdn3.emoji.gg/emojis/7943-linered.png'
    },
    {
        name: 'neuronBlueLine',
        attachment: 'https://cdn3.emoji.gg/emojis/4372-lineblue.png'
    },
    {
        name: 'neuronBlank',
        attachment: 'https://cdn3.emoji.gg/emojis/3263_Blank.png'
    },
]

const _emojis: Emoji[] = [];

export function displayEmptyEmoji(): string {
    return _emojis[3].toString();
}

export async function registerProgressBarEmojis(client: Client<true>) {
    const emojis = await client.application.emojis.fetch();

    for ( const metadata of _emojiMetadata ) {
        const emoji = emojis.find(e => e.name == metadata.name);
        if ( emoji ) {
            _emojis.push(emoji);
        } else {
            _emojis.push(await client.application.emojis.create(metadata));
        }
    }
}

export function generateProgressBar(type: number, percent: number, length: number): string {
    const emoji = _emojis[type];
    const blankEmoji = _emojis[3];
    if (!emoji) throw new Error("Invalid Emoji type");

    const numOfEmojis = Math.ceil((length * percent) / 100);
    const bar = new Array(numOfEmojis).fill(emoji.toString()).join('');
    const empty = new Array(1).fill(blankEmoji.toString()).join('');
    return `${bar}${empty}`;
}