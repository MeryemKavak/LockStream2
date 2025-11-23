const StellarSdk = require('@stellar/stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

async function testConnection() {
  try {
    // Geçerli bir public key koyun (56 char, G ile başlar)
    const account = await server.accounts().accountId('GCHQOEGYIFS5QAFR6GPC7SUMK22MAFV7JMFZDBYF7JKBPXYGO3BVGHIM').call();
    console.log('Hesap bulundu:', account);
  } catch (error) {
    console.log('Bağlantı testi:', error.message);
  }
}

testConnection();
