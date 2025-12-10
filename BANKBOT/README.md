# Kingdom 3946 Discord Bank Bot

Discord bot untuk Kingdom 3946 yang menyediakan fitur manajemen bank dan laporan kontribusi member secara langsung dari database.

## 🌟 Fitur Utama

- **Direct Database Access**: Bot mengakses database langsung tanpa memerlukan autentikasi dari backend API
- **No Authentication Required**: Semua command bot dapat diakses tanpa login
- **Real-time Data**: Data langsung dari database, tidak perlu API endpoint
- **Excel Report Generation**: Generate laporan dalam format Excel

## 📋 Available Commands

### 1. `/bank-alliance`
Menampilkan informasi lengkap tentang alliance/bank tertentu.
- **Parameter**: Tidak ada (menampilkan semua alliance)
- **Output**: Detail alliance, total members, total RSS

### 2. `/report-user`
Menampilkan laporan kontribusi detail untuk user tertentu.
- **Parameter**: 
  - `alliance_id` (required) - Pilih alliance terlebih dahulu
  - `username` (required, autocomplete) - Username akan di-filter berdasarkan alliance yang dipilih
- **Output**: Detail kontribusi per week, total RSS, average per week
- **File**: Excel report attachment
- **Note**: Autocomplete hanya menampilkan users dari alliance yang dipilih

### 3. `/bank-rank`
Menampilkan ranking top 10 donors berdasarkan total RSS.
- **Parameter**: 
  - `alliance_id` (required) - Pilih alliance untuk melihat ranking
- **Output**: Leaderboard dengan emoji medals (🥇🥈🥉)
- **Data**: Food, Wood, Stone, Gold, Total RSS, Weeks, Average
- **Note**: Ranking hanya dari members alliance yang dipilih

### 4. `/download-report`
Generate dan download laporan lengkap alliance dalam format Excel.
- **Parameter**: 
  - `alliance_id` (required) - Pilih alliance yang ingin diunduh laporannya
  - `bank_name` (optional) - Nama bank untuk judul
- **Output**: Excel file dengan detail semua member
- **Features**: Formatted Excel, ranking, summary statistics
- **Note**: File hanya berisi data members dari alliance yang dipilih

## 🔧 Setup

### 1. Install Dependencies
```bash
cd BANKBOT
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` dan isi dengan konfigurasi Anda:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_application_id_here

# Database Configuration (Connect to same database as backend)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=sf

# Application Configuration
NODE_ENV=development
BOT_PREFIX=/

# Test Mode (Set to 'true' to skip command registration)
BOT_TEST_MODE=false
```

### 3. Run the Bot
```bash
npm start
```

atau dengan Node.js langsung:
```bash
node index.js
```

## 🗄️ Database Requirements

Bot ini mengakses database yang sama dengan backend aplikasi. Pastikan:
- ✅ Database `sf` sudah dibuat dan ter-setup
- ✅ Tabel `alliances`, `users`, `member_contributions` sudah ada
- ✅ Credentials database di `.env` sudah benar

## 🚀 Architecture

```
BANKBOT/
├── bot/
│   └── DiscordBot.js       # Main bot logic, commands handler
├── config/
│   └── database.js         # Database connection (Sequelize)
├── models/
│   ├── Alliance.js         # Alliance model
│   ├── User.js             # User model
│   └── MemberContribution.js  # Contribution model
├── utils/
│   └── excelReportGenerator.js  # Excel report generation
├── public/uploads/         # Generated Excel files
├── index.js               # Bot entry point
└── .env                   # Environment configuration
```

## 🔐 Security Notes

### Why Direct Database Access?
Bot menggunakan **direct database access** untuk menghindari masalah autentikasi dengan backend API. Keuntungan:

1. ✅ **No Authentication**: Tidak perlu JWT token atau session
2. ✅ **Independent**: Bot tidak tergantung backend server status
3. ✅ **Performance**: Lebih cepat karena tidak ada HTTP overhead
4. ✅ **Reliability**: Lebih reliable karena tidak ada network issues

### Data Isolation & Security
- ✅ **Alliance-Based Filtering**: Semua commands (kecuali `/bank-alliance`) memerlukan `alliance_id` parameter
- ✅ **Isolated Data**: Users hanya bisa melihat data dari alliance yang mereka pilih
- ✅ **No Cross-Alliance Access**: Report dan ranking di-filter berdasarkan alliance_id
- ✅ **Read-Only Operations**: Bot hanya melakukan **READ operations** dari database
- ✅ **No Write Access**: Tidak ada write/update/delete operations
- ✅ **Autocomplete Filtering**: Username autocomplete hanya menampilkan users dari alliance yang dipilih
- ✅ **Environment Variables**: Database credentials disimpan di `.env` (tidak di-commit ke git)
- ✅ **Limited Table Access**: Hanya akses tables yang diperlukan (users, alliances, contributions)

## 📊 Command Examples

### Get Alliance Info
```
/bank-alliance
```
Output: List semua alliance dengan info RSS

### Get User Report (Per Alliance)
```
/report-user alliance_id: 1 username: john_doe
```
Output: Excel file dengan history kontribusi user (hanya dari alliance yang dipilih)

### View Rankings (Per Alliance)
```
/bank-rank alliance_id: 1
```
Output: Top 10 donors dengan detail kontribusi dari alliance yang dipilih

### Download Alliance Report
```
/download-report alliance_id: 1 bank_name: PolMan Bank
```
Output: Excel file dengan laporan lengkap semua member dari alliance tersebut

## 🐛 Troubleshooting

### Bot tidak muncul di server
- Pastikan bot sudah di-invite dengan permission yang benar
- Cek `DISCORD_CLIENT_ID` dan `DISCORD_TOKEN` di `.env`

### Database connection error
- Cek credentials database di `.env`
- Pastikan MySQL server berjalan
- Pastikan database `sf` sudah dibuat

### Commands tidak muncul
- Tunggu beberapa menit (Discord cache)
- Set `BOT_TEST_MODE=false` di `.env`
- Restart bot

### Excel file tidak ter-generate
- Cek folder `public/uploads/` ada dan writable
- Pastikan package `exceljs` ter-install

## 📝 Development Notes

### Adding New Commands
1. Register command di `registerCommands()` method
2. Add handler di `interactionCreate` event
3. Implement handler method (e.g., `handleNewCommand()`)

### Database Models
Models menggunakan Sequelize ORM. Untuk menambah model baru:
1. Buat file di `models/`
2. Import di `bot/DiscordBot.js`
3. Gunakan untuk query data

### Excel Report Customization
Edit `utils/excelReportGenerator.js` untuk:
- Mengubah format Excel
- Menambah columns
- Customize styling
- Add charts/graphs

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

Kingdom 3946 Project - Internal Use Only

## 👥 Support

Untuk bantuan atau pertanyaan:
- Discord: Kingdom 3946 Server
- GitHub Issues: Report bugs di repository

---

**Note**: Bot ini adalah bagian dari Kingdom 3946 Management System dan mengakses database yang sama dengan backend aplikasi web.
