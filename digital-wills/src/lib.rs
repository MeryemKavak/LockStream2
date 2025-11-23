#![no_std]
use soroban_sdk::{contractimpl, Env};

pub struct Will;

#[contractimpl]
impl Will {
    pub fn store(env: Env, message: String) {
        env.storage().set(&"message", &message);
    }

    pub fn retrieve(env: Env) -> String {
        env.storage().get(&"message").unwrap_or_default()
    }
}
