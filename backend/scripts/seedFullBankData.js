import dotenv from 'dotenv';
dotenv.config();

import db from '../config/Database.js';
import { 
    User, 
    Alliance, 
    AllianceResource, 
    MemberContribution 
} from '../models/index.js';

/**
 * Generate random RSS value between min and max
 */
const getRandomRSS = (min = 1000000, max = 20000000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Seed complete SF BANK database with 5 alliances, 100 members each, 50 weeks of data
 */
const seedFullBankData = async () => {
    try {
        console.log('🌱 Starting comprehensive SF BANK Database Seeding...\n');

        await db.authenticate();
        console.log('✅ Database connection established.\n');

        // Alliance names
        const allianceNames = [
            { name: 'Sacred', tag: 'SAC', leader: 'Sacred Lord' },
            { name: 'Forces', tag: 'FOR', leader: 'Force Commander' },
            { name: 'Dawn', tag: 'DWN', leader: 'Dawn Prophet' },
            { name: 'Reborn', tag: 'REB', leader: 'Reborn Phoenix' },
            { name: 'Mistic', tag: 'MIS', leader: 'Mistic Sage' }
        ];

        console.log('1️⃣  Creating 5 alliances...');
        const alliances = [];
        
        for (const allianceName of allianceNames) {
            const alliance = await Alliance.create({
                name: allianceName.name,
                tag: allianceName.tag,
                leader: allianceName.leader,
                members_count: 100,
                description: `${allianceName.name} Alliance - Powerful kingdom`,
                weeks_donated: 50
            });
            alliances.push(alliance);
            console.log(`   ✅ Created alliance: ${alliance.name}`);
        }
        console.log('   ✅ Completed 5 alliances\n');

        console.log('2️⃣  Creating 100 members per alliance (500 total users)...');
        const users = [];
        let userCount = 0;

        for (const alliance of alliances) {
            for (let i = 1; i <= 100; i++) {
                const user = await User.create({
                    user_id: `${alliance.tag}-${String(i).padStart(3, '0')}`,
                    name: `${alliance.name} Member ${i}`,
                    email: `member.${alliance.tag.toLowerCase()}.${i}@sfbank.com`,
                    password: 'password123',
                    role: 'R5',
                    alliance_id: alliance.id,
                    status: 'Active',
                    joined_date: new Date(2024, 0, 1)
                });
                users.push(user);
                userCount++;

                if (userCount % 100 === 0) {
                    console.log(`   ✅ Created ${userCount} users`);
                }
            }
        }
        console.log(`   ✅ Total users created: ${userCount}\n`);

        console.log('3️⃣  Creating member contributions (50 weeks x 500 members)...');
        let contributionCount = 0;

        for (const user of users) {
            for (let week = 1; week <= 50; week++) {
                // Random RSS values for each resource
                const food = getRandomRSS();
                const wood = getRandomRSS();
                const stone = getRandomRSS();
                const gold = getRandomRSS();
                const total = food + wood + stone + gold;

                // Calculate date for this week
                const dateOfWeek = new Date(2024, 0, 1 + (week - 1) * 7);

                await MemberContribution.create({
                    member_id: user.id,
                    alliance_id: user.alliance_id,
                    week: week,
                    date: dateOfWeek,
                    food: food,
                    wood: wood,
                    stone: stone,
                    gold: gold
                });

                contributionCount++;

                if (contributionCount % 5000 === 0) {
                    console.log(`   ✅ Created ${contributionCount} contributions`);
                }
            }
        }
        console.log(`   ✅ Total contributions created: ${contributionCount}\n`);

        // Calculate totals for summary
        const totalRSS = contributionCount * (1000000 + 20000000) * 2; // Rough estimate
        const totalFood = contributionCount * 10000000; // Average
        const totalWood = contributionCount * 10000000;
        const totalStone = contributionCount * 10000000;
        const totalGold = contributionCount * 10000000;

        console.log('✨ Database seeding completed successfully!\n');
        console.log('📊 Final Summary:');
        console.log('   ✅ Alliances: 5 (Sacred, Forces, Dawn, Reborn, Mistic)');
        console.log('   ✅ Total Members: 500 (100 per alliance)');
        console.log('   ✅ Total Contributions: 25,000 (50 weeks × 500 members)');
        console.log('   ✅ Weeks of Data: 1-50');
        console.log('   ✅ RSS per member per week: 1M-20M per resource\n');

        console.log('📈 Data Range:');
        console.log('   - Food: 1M - 20M per member per week');
        console.log('   - Wood: 1M - 20M per member per week');
        console.log('   - Stone: 1M - 20M per member per week');
        console.log('   - Gold: 1M - 20M per member per week');
        console.log('   - Total per member per week: 4M - 80M\n');

        console.log('🎯 Alliances created:');
        alliances.forEach((a, idx) => {
            console.log(`   ${idx + 1}. ${a.name} (${a.tag}) - Leader: ${a.leader}`);
        });

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
};

// Run the seeding
seedFullBankData();
