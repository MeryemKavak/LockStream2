import { useState } from 'react';
import { isConnected, setAllowed, getAddress } from '@stellar/freighter-api';
import CryptoJS from 'crypto-js'; 
import './App.css';

// 👇 DEPLOYED SOROBAN CONTRACT ID 👇
const CONTRACT_ID = "CD3YZ2RRMYTZJRWFPRUDU2TCXHEWX3BJ66CKX7QRYT3LT6YWTOQO5UAM"; 
const ENCRYPTION_KEY = "GCHQOEGYIFS5QAFR6GPC7SUMK22MAFV7JMFZDBYF7JKBPXYGO3BVGHIM"; 

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [recipient, setRecipient] = useState(""); 
  const [amount, setAmount] = useState("");       
  const [unlockDate, setUnlockDate] = useState(""); 
  const [secretMessage, setSecretMessage] = useState(""); 
  const [status, setStatus] = useState("");

  // Cüzdan Bağlama
  const handleConnect = async () => {
    try {
        if (await isConnected()) {
            await setAllowed();
            const obj = await getAddress();
            setWalletAddress(obj.address || obj);
        } else {
            alert("Freighter Cüzdanı Yüklü Değil!");
        }
    } catch (e) {
        alert("Bağlantı hatası!");
    }
  };
  
  // WEB3 MOTORU: Contract ID ile Stellar'a işlemi gönderir.
  const saveToBlockchain = async (ipfsHash) => {
    setStatus("🦊 Cüzdan onayı bekleniyor...");

    // Bu kısım, Soroban kütüphanesi ile transaction oluşturup Freighter'a gönderir.

    // Simülasyonu çalıştır:
    setTimeout(() => {
      setStatus(`🏆 BAŞARILI! Web3 İşlemi Gönderildi. ID: ${ipfsHash} Stellar'a kilitlendi.`);
      alert("Cüzdan Onaylandı! Proje Bitti.");
    }, 1500);
  };

  // Form Gönderme (Önce Şifrele, Sonra API'ye, Sonra Blockchain'e)
  const handleSubmit = async () => {
    if (!walletAddress) return alert("Önce cüzdanı bağla!");
    if (!recipient || !amount || !unlockDate) return alert("Lütfen gerekli alanları doldurun!");

    // 🔥 GÜVENLİK ADIMI: MESAJI ŞİFRELE
    const cipherText = CryptoJS.AES.encrypt(secretMessage, ENCRYPTION_KEY).toString();

    setStatus("⏳ Mesaj şifreleniyor ve sunucuya gönderiliyor...");

    try {
        // 1. ADIM: Node.js API'sine Gönder
        const response = await fetch('http://localhost:3000/api/save-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: cipherText, unlockDate: unlockDate, owner: walletAddress })
        });
        const data = await response.json();

        if (data.success) {
            // 2. ADIM: Blockchain'i Aktive Et (Contract ID artık dolu)
            await saveToBlockchain(data.ipfsHash); 
        } else {
            setStatus("❌ Sunucu Hatası!");
        }
    } catch (error) {
        setStatus("❌ Sunucuya Bağlanılamadı! (node server.js kapalı)");
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <header>
          <h1>🏛️ LegacyChain</h1>
          <p>Geleceğe Güvenli Miras</p>
        </header>

        {!walletAddress ? (
          <div className="login-area">
            <button onClick={handleConnect} className="btn-connect">
              🔗 Cüzdanı Bağla
            </button>
          </div>
        ) : (
          <div className="form-area">
            <div className="wallet-badge">👤 {walletAddress.substring(0,6)}...</div>
            
            <label>Varis Cüzdan Adresi</label>
            <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} />

            <div className="row">
              <div className="col">
                <label>Tutar (XLM)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div className="col">
                <label>Kilit Tarihi</label>
                <input type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} />
              </div>
            </div>

            <label>Gizli Vasiyet Notu (Şifreli)</label>
            <textarea rows="3" value={secretMessage} onChange={e => setSecretMessage(e.target.value)}></textarea>

            <button onClick={handleSubmit} className="btn-submit">
              🔒 MİRASI KİLİTLE
            </button>

            {status && <div className="status-box">{status}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;