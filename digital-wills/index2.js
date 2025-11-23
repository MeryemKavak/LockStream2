// ...existing code...
import { Server } from "@stellar/stellar-sdk";

async function main() {
    const server = new Server("https://horizon-testnet.stellar.org");

    // Replace with a full valid Stellar public key (56 chars, starts with 'G')
    const publicKey = "GCHQOEGYIFS5QAFR6GPC7SUMK22MAFV7JMFZDBYF7JKBPXYGO3BVGHIM";

    try {
        const account = await server.loadAccount(publicKey);
        // account.id or account.accountId() may exist depending on SDK version
        console.log("Bağlandı. Account:", account.id ?? (account.accountId ? account.accountId() : publicKey));
    } catch (err) {
        console.error("Hata:", err.response?.data || err.message || err);
    }
}

main();
// ...existing code...
