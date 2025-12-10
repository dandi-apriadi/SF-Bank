# Discord Bot - Kingdom 3946 Bank System

Bot Discord yang terintegrasi dengan backend Kingdom 3946 untuk menyediakan akses informasi bank aliansi dan laporan kontribusi user secara real-time.

## 🎯 Fitur

### 1. `/bank-alliance`
Menampilkan daftar lengkap semua aliansi yang terdaftar beserta informasi RSS bank mereka.

**Informasi yang ditampilkan:**
- Nama aliansi dan tag
- Leader aliansi
- Jumlah member
- Detail RSS (Food, Wood, Stone, Gold)
- Total RSS keseluruhan
- Ranking berdasarkan total RSS

**Contoh penggunaan:**
```
/bank-alliance
```

### 2. `/report-user [user_id]`
Menampilkan laporan lengkap kontribusi RSS dari user tertentu.

**Informasi yang ditampilkan:**
- Info user (ID, Name, Email, Role)
- Alliance yang diikuti
- Total kontribusi per resource (Food, Wood, Stone, Gold)
- Grand total RSS yang disumbangkan
- Breakdown kontribusi per minggu (weekly detail)

**Contoh penggunaan:**
```
/report-user 1
/report-user 25
```

## 🚀 Setup & Konfigurasi

### 1. Install Dependencies
```bash
cd backend
npm install discord.js
```

### 2. Konfigurasi Discord Bot

#### a. Buat Discord Application
1. Kunjungi [Discord Developer Portal](https://discord.com/developers/applications)
2. Klik "New Application"
3. Beri nama aplikasi (contoh: "Kingdom 3946 Bot")
4. Simpan **Application ID** (ini adalah DISCORD_CLIENT_ID)

#### b. Create Bot User
1. Di application yang sudah dibuat, klik menu "Bot"
2. Klik "Add Bot"
3. Copy **Bot Token** (ini adalah DISCORD_TOKEN)
4. **PENTING:** Jangan share token ini ke siapapun!

#### c. Setup Bot Permissions
Di menu "Bot", aktifkan permission berikut:
- ✅ MESSAGE CONTENT INTENT
- ✅ SERVER MEMBERS INTENT (optional)
- ✅ PRESENCE INTENT (optional)

#### d. Invite Bot ke Server
1. Klik menu "OAuth2" → "URL Generator"
2. Pilih scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Pilih bot permissions:
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Use Slash Commands
4. Copy URL yang dihasilkan
5. Buka URL di browser dan invite bot ke server Discord Anda

### 3. Konfigurasi Environment Variables

Edit file `backend/.env` dan tambahkan:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
```

**Cara mendapatkan nilai:**
- `DISCORD_TOKEN`: Copy dari Discord Developer Portal → Your App → Bot → Token
- `DISCORD_CLIENT_ID`: Copy dari Discord Developer Portal → Your App → General Information → Application ID

### 4. Jalankan Server

Bot akan otomatis aktif ketika server backend menyala:

```bash
cd backend
npm start
```

atau untuk development mode:

```bash
cd backend
npm run dev
```

### 5. Verifikasi Bot Berjalan

Jika berhasil, Anda akan melihat log:
```
✅ Discord Bot is ready! Logged in as Kingdom 3946 Bot#1234
📡 Bot is active in 1 server(s)
✅ Discord slash commands registered successfully!
🚀 Discord Bot started successfully!
```

## 📝 Cara Menggunakan

### Di Discord Server:

1. **Lihat daftar bank aliansi:**
   - Ketik `/bank-alliance`
   - Bot akan menampilkan embed dengan informasi semua aliansi

2. **Lihat report user:**
   - Ketik `/report-user` lalu pilih parameter `user_id`
   - Masukkan ID user yang ingin dilihat
   - Bot akan menampilkan laporan lengkap kontribusi user tersebut

## 🎨 Tampilan Embed

Bot menggunakan Discord Embed dengan tema medieval (warna gold) untuk menampilkan informasi dengan format yang menarik dan mudah dibaca.

### Color Scheme:
- 🟡 **Gold (#FFD700)**: Bank Alliance list
- 🔵 **Royal Blue (#4169E1)**: User report summary
- 🟣 **Medium Purple (#9370DB)**: Weekly breakdown details
- 🔴 **Tomato Red (#FF6347)**: Error/No data messages

## 🔧 Troubleshooting

### Bot tidak muncul online
- Pastikan DISCORD_TOKEN benar
- Pastikan bot sudah diinvite ke server dengan permission yang tepat
- Check console untuk error messages

### Slash commands tidak muncul
- Pastikan DISCORD_CLIENT_ID sudah benar
- Tunggu beberapa menit (Discord perlu waktu untuk sync commands)
- Restart Discord client Anda
- Pastikan bot memiliki permission `applications.commands`

### Error "Missing Access"
- Pastikan bot memiliki permission untuk:
  - Send Messages
  - Embed Links
  - Use Slash Commands
- Check role hierarchy di server Discord

### Database connection error
- Pastikan backend database sudah running
- Check konfigurasi database di `.env`
- Verify models sudah ter-import dengan benar

## 🔐 Security Notes

1. **JANGAN** commit file `.env` ke repository
2. **JANGAN** share Discord Bot Token ke siapapun
3. Gunakan `.gitignore` untuk exclude `.env`
4. Regenerate token jika token ter-expose
5. Implement rate limiting jika diperlukan

## 📊 Database Schema yang Digunakan

Bot mengakses tabel berikut:
- `alliances`: Data aliansi
- `member_contributions`: Data kontribusi RSS member
- `users`: Data user/member

## 🚀 Production Deployment

Untuk production, pastikan:
1. Set `NODE_ENV=production` di `.env`
2. Gunakan process manager (PM2, systemd, etc)
3. Enable auto-restart on crash
4. Setup monitoring dan logging
5. Backup Discord Bot Token dengan aman

### Example PM2 Configuration:
```bash
pm2 start index.js --name "kingdom-backend"
pm2 save
pm2 startup
```

## 📞 Support

Jika ada masalah atau pertanyaan, hubungi:
- Developer: Kingdom 3946 Dev Team
- Discord: [Your Discord Server]
- GitHub: [Your Repository]

## 📜 License

Sesuai dengan license project Kingdom 3946.

---

**Made with ⚔️ for Kingdom 3946**
