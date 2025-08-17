use common::bindings::dao_canister::ProposalVerdict;

pub fn vote_deciding_strategy(vote_accept: u128, vote_reject: u128) -> ProposalVerdict {
    if vote_accept > vote_reject {
        ProposalVerdict::Accepted
    } else {
        ProposalVerdict::Rejected
    }
}