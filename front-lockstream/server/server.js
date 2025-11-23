const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db = {};

// Gelen şifreli mesajı alır ve ID üretir.
app.post('/api/save-message', (req, res) => {
    const { message, unlockDate, owner } = req.body;
    
    // Rastgele ID üret
    const ipfsHash = "Qm" + Math.random().toString(36).substring(2, 15).toUpperCase();
    
    // Kaydet (Mesaj şifreli olarak kalır)
    db[ipfsHash] = { message, unlockDate, owner };
    
    console.log(`✅ Mesaj alındı. ID: ${ipfsHash}`);
    
    res.json({ success: true, ipfsHash: ipfsHash });
});

app.listen(3000, () => console.log("🚀 SUNUCU HAZIR: Backend API (3000) çalışıyor."));