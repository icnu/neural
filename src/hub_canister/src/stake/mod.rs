use candid::Principal;
use common::bindings::icp::{Account, Service as IcpService};
use crate::stake::subaccount::subaccount_from_id;

mod subaccount;

const ICP_PRINCIPAL: &str = "ryjl3-tyaaa-aaaaa-aaaba-cai";

pub fn get_payment_account(id: u64) -> Account {
    Account { owner: ic_cdk::id(), subaccount: Some(subaccount_from_id(id).into()) }
}

pub async fn validate_account_balance(id: u64, amount: u64) -> bool {
    let service = IcpService(Principal::from_text(ICP_PRINCIPAL).unwrap());
    let (balance,) = service.icrc_1_balance_of(&get_payment_account(id)).await.unwrap();
    balance == amount
}