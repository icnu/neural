use ic_siwe::eth::EthSignature;

use crate::login::nonce::{generate_user_nonce, get_user_nonce};

mod nonce;

pub fn generate_login_message(user: String) -> String {
    let nonce = generate_user_nonce(&user);

    format!(
        "Neural wants you to sign with your Ethereum account:\n
        {user}\n

        Version: 1
        Nonce: {nonce}
        "
    )
}

fn get_stored_login_message(user: &String) -> String {
    let nonce = get_user_nonce(&user).unwrap();

    format!(
        "Neural wants you to sign with your Ethereum account:\n
        {user}\n

        Version: 1
        Nonce: {nonce}
        "
    )
}

pub fn verify_signature(user: &String, signature: &String) -> bool {
    let message = &get_stored_login_message(&user);
    let expected = ic_siwe::eth::recover_eth_address(message, &EthSignature::new(&signature).unwrap()).unwrap();
    expected.to_lowercase() == user.to_ascii_lowercase()
}