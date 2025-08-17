import { SnsAction, SnsPercentage, SnsProposalData, SnsTally, SnsTopic, SnsVote } from "@dfinity/sns";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionEditReplyOptions } from "discord.js";
import { displayEmptyEmoji, generateProgressBar } from "./progress";

export const MINIMUM_YES_PROPORTION_OF_TOTAL_VOTING_POWER = BigInt(300)
export const MINIMUM_YES_PROPORTION_OF_EXERCISED_VOTING_POWER = BigInt(5_000);

export const fromPercentageBasisPoints = (
  value: [] | [SnsPercentage]
): bigint | undefined => {
  const percentage = value[0];
  return percentage
    ? percentage.basis_points[0]
    : undefined;
};

const minimumYesProportionOfTotal = (
  proposal: SnsProposalData
): bigint =>
  // `minimum_yes_proportion_of_total` property could be missing in older canister versions
  fromPercentageBasisPoints(proposal.minimum_yes_proportion_of_total ?? []) ??
  MINIMUM_YES_PROPORTION_OF_TOTAL_VOTING_POWER;

const minimumYesProportionOfExercised = (
  proposal: SnsProposalData
): bigint =>
  // `minimum_yes_proportion_of_exercised` property could be missing in older canister versions
  fromPercentageBasisPoints(
    proposal.minimum_yes_proportion_of_exercised ?? []
  ) ?? MINIMUM_YES_PROPORTION_OF_EXERCISED_VOTING_POWER;

const majorityDecision = ({
  yes,
  no,
  total,
  requiredYesOfTotalBasisPoints,
}: {
  yes: bigint;
  no: bigint;
  total: bigint;
  requiredYesOfTotalBasisPoints: bigint;
}): SnsVote => {
  // 10_000n is 100% in basis points
  const requiredNoOfTotalBasisPoints = BigInt(10_000) - requiredYesOfTotalBasisPoints;

  if (yes * BigInt(10_000) > total * requiredYesOfTotalBasisPoints) {
    return SnsVote.Yes;
  } else if (no * BigInt(10_000) >= total * requiredNoOfTotalBasisPoints) {
    return SnsVote.No;
  } else {
    return SnsVote.Unspecified;
  }
};

export const isAccepted = (proposal: SnsProposalData): boolean => {
  const { latest_tally } = proposal;
  const tally = latest_tally[0];

  if (tally === undefined) {
    return false;
  }

  const { yes, no, total } = tally;
  const majorityMet =
    majorityDecision({
      yes,
      no,
      total: yes + no,
      requiredYesOfTotalBasisPoints: minimumYesProportionOfExercised(proposal),
    }) == SnsVote.Yes;
  const quorumMet =
    yes * BigInt(10_000) >= total * minimumYesProportionOfTotal(proposal);

  return quorumMet && majorityMet;
};

function renderTally(tally: SnsTally | undefined): string {
    if ( !tally ) return '';

    const yesPercent = (tally.yes * BigInt(10_000)) / tally.total;
    const yesPercentNum = Number.parseInt(yesPercent.toString()) / 100;
    const noPercent = (tally.no * BigInt(10_000)) / tally.total;
    const noPercentNum = Number.parseInt(noPercent.toString()) / 100;

    return `
    Yes: ${generateProgressBar(0, yesPercentNum, 20)} ${yesPercentNum.toFixed(2)}%
    No : ${generateProgressBar(1, noPercentNum, 20)} ${noPercentNum.toFixed(2)}%
    `;
}

function cleanProposalSummary(proposalSummary: string): string {
    return proposalSummary
        .replace(/<br>/g, '\n')
        .replace(/\[.*?\]\((https?:\/\/[^\s)]+)\)/g, '$1');
}

function isProposalUnderVoting(proposal: SnsProposalData): boolean {
    return proposal.decided_timestamp_seconds == BigInt(0);
}

function getProposalStatus(proposal: SnsProposalData): string {
    if ( isProposalUnderVoting(proposal) ) return "Open";

    if (isAccepted(proposal)) {
        if (proposal.executed_timestamp_seconds > BigInt(0)) return "Executed";
        if (proposal.failed_timestamp_seconds > BigInt(0)) return "Failed";
        return "Adopted";
    }
    return "Rejected";
}

function getTopicString(action: SnsTopic | {}) {
    const key = Object.keys(action)[0];
    if ( !key ) return "Unspecified"

    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\bSns\b/i, 'SNS');
}

export function renderProposal(
    proposal: SnsProposalData,
    voteButtonId: string,
    rootCanisterId: string,
): InteractionEditReplyOptions {
    const tally = proposal.latest_tally[0];
    const votingDeadline = 
        proposal.wait_for_quiet_state[0]?.current_deadline_timestamp_seconds ??
        proposal.proposal_creation_timestamp_seconds + proposal.initial_voting_period_seconds;

    const proposalTitle = proposal.proposal[0]?.title ?? '';
    const proposalSummary = proposal.proposal[0]?.summary ?? '';
    const proposalTopic = proposal.topic[0] ?? {};
    const proposalId = proposal.id[0]?.id.toString() ?? '0';
    
    const content = 
    `
    ## ${proposalTitle}

    ${cleanProposalSummary(proposalSummary)}

### Votes
    ${renderTally(tally)}
### Details
    Status:${displayEmptyEmoji()}${displayEmptyEmoji()}${displayEmptyEmoji()}${getProposalStatus(proposal)}
    Creation: ${displayEmptyEmoji()}${displayEmptyEmoji()}<t:${proposal.proposal_creation_timestamp_seconds}:F>
    ${
        isProposalUnderVoting(proposal) ?
        `Voting Ends:${displayEmptyEmoji()}<t:${votingDeadline}:R>` :
        ""
    }
    `;

    const embed = new EmbedBuilder()
        .setTitle(getTopicString(proposalTopic))
        .setDescription(content);
        
    const row = new ActionRowBuilder();

    const button = new ButtonBuilder()
            .setLabel('View in NNS')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://nns.ic0.app/proposal/?u=${rootCanisterId}&proposal=${proposalId}`);

    row.addComponents(button);

    if ( isProposalUnderVoting(proposal) ) {
        const button = new ButtonBuilder()
            .setCustomId(voteButtonId)
            .setLabel('Vote')
            .setStyle(ButtonStyle.Primary);
        
        row.addComponents(button);
    }

    return ({
        embeds: [embed],
        components: [row.toJSON()]
    });
}