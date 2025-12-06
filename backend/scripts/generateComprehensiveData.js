import db from '../config/Database.js';
import { User, Alliance } from '../models/index.js';

/**
 * Generate comprehensive data for 5 alliances with 100 members each
 * Total: 500 users across 50 weeks with random RSS values
 */

const generateAllianceData = async () => {
    try {
        console.log('🌱 Starting comprehensive SF BANK data generation...\n');
        
        // Test connection
        await db.authenticate();
        console.log('✅ Database connection established\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await db.query('DELETE FROM member_contributions');
        await db.query('DELETE FROM users');
        await db.query('DELETE FROM alliance_bank');
        await db.query('DELETE FROM alliance_resources');
        await db.query('DELETE FROM alliances');
        console.log('✅ Old data cleared\n');

        // 1. Create 5 Alliances
        console.log('1️⃣  Creating 5 alliances...');
        const allianceNames = ['Sacred', 'Forces', 'Dawn', 'Reborn', 'Mystic'];
        const allianceTags = ['SAC', 'FOR', 'DWN', 'RBN', 'MYS'];
        
        const alliances = [];
        for (let i = 0; i < 5; i++) {
            const alliance = await Alliance.create({
                name: allianceNames[i],
                tag: allianceTags[i],
                leader: `Leader_${allianceNames[i]}`,
                members_count: 100,
                description: `${allianceNames[i]} Alliance - A powerful kingdom alliance`,
                bank_id: `BANK_${allianceTags[i]}`,
                bank_name: `${allianceNames[i]} Treasury`
            });
            alliances.push(alliance);
            console.log(`   ✅ Created: ${allianceNames[i]}`);
        }
        console.log();

        // 2. Create users for each alliance
        console.log('2️⃣  Creating 500 users (100 per alliance)...');
        const users = [];
        let userCount = 0;
        
        for (let allianceIdx = 0; allianceIdx < alliances.length; allianceIdx++) {
            const alliance = alliances[allianceIdx];
            
            for (let memberNum = 1; memberNum <= 100; memberNum++) {
                const roles = ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5'];
                const roleIdx = memberNum % 6; // Distribute roles evenly
                
                const user = await User.create({
                    user_id: `USER_${alliance.tag}_${String(memberNum).padStart(3, '0')}`,
                    name: `Player_${alliance.name}_${memberNum}`,
                    email: `user_${alliance.tag.toLowerCase()}_${memberNum}@kingdom3946.com`,
                    password: 'defaultPass123', // Will be hashed by hook
                    role: roles[roleIdx],
                    alliance_id: alliance.id,
                    status: 'Active',
                    joined_date: new Date('2024-01-01')
                });
                users.push(user);
                userCount++;
            }
            
            console.log(`   ✅ Created 100 users for ${alliance.name}`);
        }
        console.log(`   📊 Total users created: ${userCount}\n`);

        // 3. Create member contributions for 50 weeks
        console.log('3️⃣  Creating member contributions across 50 weeks...');
        let contributionCount = 0;
        
        const { MemberContribution } = await import('../models/index.js');
        
        for (let week = 1; week <= 50; week++) {
            for (let userIdx = 0; userIdx < users.length; userIdx++) {
                const user = users[userIdx];
                
                // Generate random RSS values between 1M - 20M per resource
                const generateRss = () => {
                    return Math.floor(Math.random() * 19000000) + 1000000; // 1M - 20M
                };
                
                const food = generateRss();
                const wood = generateRss();
                const stone = generateRss();
                const gold = generateRss();
                const totalRss = food + wood + stone + gold;
                
                await MemberContribution.create({
                    member_id: user.id,
                    alliance_id: user.alliance_id,
                    week: week,
                    date: new Date(2024, 0, 1 + (week * 7)),
                    food: food,
                    wood: wood,
                    stone: stone,
                    gold: gold,
                    total_rss: totalRss
                });
                
                contributionCount++;
            }
            
            if (week % 10 === 0) {
                console.log(`   ✅ Week ${week}: ${contributionCount} contributions created`);
            }
        }
        console.log(`   📊 Total contributions created: ${contributionCount}\n`);

        // 4. Update alliance resource summaries
        console.log('4️⃣  Updating alliance resource summaries...');
        for (const alliance of alliances) {
            const contributions = await MemberContribution.findAll({
                where: { alliance_id: alliance.id }
            });
            
            let totalFood = 0, totalWood = 0, totalStone = 0, totalGold = 0;
            contributions.forEach(c => {
                totalFood += c.food;
                totalWood += c.wood;
                totalStone += c.stone;
                totalGold += c.gold;
            });
            
            // Update or create alliance resources
            const { AllianceResource } = await import('../models/index.js');
            await AllianceResource.upsert({
                alliance_id: alliance.id,
                food: totalFood,
                wood: totalWood,
                stone: totalStone,
                gold: totalGold,
                total_rss: totalFood + totalWood + totalStone + totalGold,
                weeks_donated: 50
            });
            
            console.log(`   ✅ Updated ${alliance.name} resources`);
        }
        console.log();

        // 5. Summary
        console.log('✨ Data generation completed successfully!\n');
        console.log('📊 Final Summary:');
        console.log(`   - Alliances: 5 (Sacred, Forces, Dawn, Reborn, Mystic)`);
        console.log(`   - Total Users: ${userCount}`);
        console.log(`   - Users per Alliance: 100`);
        console.log(`   - Total Contributions: ${contributionCount}`);
        console.log(`   - Weeks of Data: 50`);
        console.log(`   - RSS Range per Resource: 1M - 20M`);
        console.log('\n🔐 Test Accounts:');
        
        // Show sample accounts
        const sampleUsers = await User.findAll({ limit: 5 });
        sampleUsers.forEach((user, idx) => {
            console.log(`   ${idx + 1}. ${user.email} (Role: ${user.role})`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during data generation:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
};

generateAllianceData();
