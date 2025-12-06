#!/bin/bash

# Quick Fix Script for SF BANK Database Seeding on VPS
# Run this script to automatically fix "No database selected" error

echo "🔧 SF BANK Database Quick Fix Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to backend directory
cd /var/www/sf/backend || {
    echo -e "${RED}❌ Error: Backend directory not found!${NC}"
    echo "Expected: /var/www/sf/backend"
    exit 1
}

echo -e "${GREEN}✅ Changed to backend directory${NC}"
echo ""

# Check if .env exists
echo "1️⃣  Checking .env file..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo ""
    echo "Creating .env from template..."
    
    cat > .env << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=prima
DB_PORT=3306

# Database Pool
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Sequelize Settings
SEQUELIZE_LOGGING=false
SEQUELIZE_BENCHMARK=false

# JWT Settings
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001
EOF
    
    echo -e "${YELLOW}⚠️  .env file created. Please edit it with your credentials:${NC}"
    echo "   nano .env"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Check environment variables
echo "2️⃣  Checking environment variables..."
source .env 2>/dev/null || true

if [ -z "$DB_NAME" ]; then
    echo -e "${RED}❌ DB_NAME not set in .env!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ DB_NAME: $DB_NAME${NC}"
echo ""

# Check MySQL service
echo "3️⃣  Checking MySQL service..."
if systemctl is-active --quiet mysql || systemctl is-active --quiet mysqld; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL is not running. Starting...${NC}"
    sudo systemctl start mysql || sudo systemctl start mysqld
    sleep 2
    
    if systemctl is-active --quiet mysql || systemctl is-active --quiet mysqld; then
        echo -e "${GREEN}✅ MySQL started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start MySQL${NC}"
        exit 1
    fi
fi
echo ""

# Check database configuration
echo "4️⃣  Checking database configuration..."
node scripts/checkDatabaseConfig.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database configuration check failed!${NC}"
    echo ""
    echo "Please fix the issues above and run this script again."
    exit 1
fi
echo ""

# Setup database tables
echo "5️⃣  Setting up database tables..."
node scripts/databaseSetup.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database setup failed!${NC}"
    exit 1
fi
echo ""

# Run seeding
echo "6️⃣  Running database seeding..."
echo -e "${YELLOW}⏳ This may take several minutes (creating 25,000 records)...${NC}"
echo ""

node scripts/seedFullBankDataRobust.js
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✨ SUCCESS! Database seeding completed!${NC}"
    echo ""
    echo "📊 Your SF BANK database now contains:"
    echo "   - 5 Alliances"
    echo "   - 500 Users (100 per alliance)"
    echo "   - 25,000 Contributions (50 weeks)"
    echo "   - RSS data range: 1M-20M per resource"
    echo ""
    echo "🎯 You can now start the backend server:"
    echo "   npm start"
else
    echo ""
    echo -e "${RED}❌ Seeding failed!${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check logs above for specific error"
    echo "2. Verify MySQL credentials in .env"
    echo "3. Try manual seeding: node scripts/seedFullBankData.js"
    echo "4. Read SEEDING_TROUBLESHOOTING.md for more help"
    exit 1
fi
