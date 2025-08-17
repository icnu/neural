import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { RegisterButton, RegisterSlashCommand, RegisterStringSelect } from "../commands";
import { SnsAggregatorService } from "../snsaggregator";
import { GovernanceService, VoteSession, VoteSessionService } from "./service";
import { UserService } from "../user";
import { displayFormatHexString, e8sToUnits, fromHexString, generateProgressBar, renderProposal, toHexString } from "../utils";
import { SnsVote } from "@dfinity/sns";

async function demoPrintProposalHandler(interaction: ChatInputCommandInteraction) {
    const snsName = interaction.options.getString('sns', true);
    const sns = await SnsAggregatorService.resolveSnsByName(snsName);
    if ( !sns ) {
        await interaction.reply({
            content: "Invalid SNS Name."
        });
        return;
    }

    await interaction.deferReply();
    const proposal = await GovernanceService.listLastProposal(sns.governance_canister_id);
    const voteSession: VoteSession = {
        proposalId: proposal.id[0]!,
        canisterId: sns.governance_canister_id
    };
    const voteSessionId = await VoteSessionService.createVoteSession(voteSession);

    await interaction.editReply(renderProposal(proposal, `list_neurons:${voteSessionId}`, sns.root_canister_id))
}

async function listNeuronsHandler(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const buttonId = interaction.customId;
    const voteSessionId = buttonId.split(':')[1];
    const voteSession = VoteSessionService.resolveVoteSession(voteSessionId);
    if ( !voteSession ) {
        interaction.editReply({ content: "Invalid or expired interaction" });
        return;
    }

    const userIdentity = await UserService.get_user_identity(interaction.user.id);
    if ( !userIdentity ) {
        interaction.editReply({ content: "User not logged in or session expired. Please login again" });
        return;
    }

    const neurons = await GovernanceService.listNeurons(voteSession.canisterId, userIdentity.getPrincipal().toText());
    if ( neurons.length == 0 ) {
        const embed = new EmbedBuilder()
            .setTitle('No neurons available for voting')
            .setDescription('You don\'t have eligible neurons for voting.')
            .setColor('Aqua');

        await interaction.editReply({
            embeds: [embed]
        });
        return;
    }

    const childVoteSession: VoteSession = { ...voteSession, identity: userIdentity };
    const childVoteSessionId = VoteSessionService.createVoteSession(childVoteSession);

    const embed = new EmbedBuilder()
        .setTitle('Select Neurons to Vote')
        .setDescription('Choose one or more neurons from your account to vote with.')
        .setColor('Aqua');
        
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`select_neurons:${childVoteSessionId}`)
        .setPlaceholder('Select neurons...')
        .setMinValues(1)
        .addOptions(
            neurons.map(n => ({
                label: `${displayFormatHexString(toHexString(n.id[0]!.id))}`,
                description: `Stake: ${e8sToUnits(n.cached_neuron_stake_e8s)}`,
                value: toHexString(n.id[0]!.id)
            }))
        );

    const selectRow = new ActionRowBuilder().addComponents(selectMenu).toJSON();
    const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`vote:accept:${childVoteSessionId}`)
            .setLabel('Accept Vote')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`vote:reject:${childVoteSessionId}`)
            .setLabel('Reject Vote')
            .setStyle(ButtonStyle.Danger)
    ).toJSON();

    await interaction.editReply({
        embeds: [embed],
        components: [selectRow, buttonRow],
    });
}

async function selectNeuronsHandler(interaction: StringSelectMenuInteraction) {  
    const buttonId = interaction.customId;
    const voteSessionId = buttonId.split(':')[1];
    const voteSession = VoteSessionService.resolveVoteSession(voteSessionId);
    if ( !voteSession ) {
        interaction.reply({ content: "Invalid or expired interaction", flags: MessageFlags.Ephemeral });
        return;
    }

    voteSession.neuron = (interaction.values.length >= 1 ? interaction.values[0] : undefined);
    await interaction.deferUpdate();
}

async function voteHandler(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const buttonId = interaction.customId;
    const voteSide = buttonId.split(':')[1];
    const voteSessionId = buttonId.split(':')[2];
    const voteSession = VoteSessionService.resolveVoteSession(voteSessionId);
    if ( !voteSession ) {
        interaction.editReply({ content: "Invalid or expired interaction" });
        return;
    }

    const userIdentity = await UserService.get_user_identity(interaction.user.id);
    if ( !userIdentity ) {
        interaction.editReply({ content: "User not logged in or session expired. Please login again" });
        return;
    }

    await GovernanceService.vote(
        voteSession.canisterId,
        voteSession.identity!,
        { id: fromHexString(voteSession.neuron!) },
        voteSession.proposalId,
        (voteSide == 'accept' ? SnsVote.Yes : SnsVote.No)
    );

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Vote cast successfully')
                .setDescription('Your vote has been cast successfully, you can dismiss this message now')
                .setColor('Aqua')
        ]
    });
}

const commands: RegisterSlashCommand[] = [
    {
        command: new SlashCommandBuilder()
            .setName('demo_print_proposal')
            .setDescription('Shows Login Message for users')
            .addStringOption(
                option => option
                    .setName('sns')
                    .setDescription('The SNS Name for the proposal')
                    .setRequired(true)
            ),
        handler: demoPrintProposalHandler
    },
];

const buttons: RegisterButton[] = [
    {
        id: 'list_neurons',
        handler: listNeuronsHandler
    },
    {
        id: 'vote',
        handler: voteHandler
    }
]

const stringSelects: RegisterStringSelect[] = [
    {
        id: 'select_neurons',
        handler: selectNeuronsHandler
    }
]

export default {
    commands,
    buttons,
    stringSelects
}