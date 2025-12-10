import express from 'express';
import { Op } from 'sequelize';
import { generateBankRankReport } from '../utils/excelReportGenerator.js';
import Alliance from '../models/Alliance.js';
import MemberContribution from '../models/MemberContribution.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/test/bank-alliance
 * Test endpoint for /bank-alliance command
 * Display list of all alliances with their RSS
 */
router.get('/bank-alliance', async (req, res) => {
    try {
        // Fetch all alliances
        const alliances = await Alliance.findAll({
            order: [['name', 'ASC']]
        });

        if (!alliances || alliances.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No alliances registered in the database'
            });
        }

        // Calculate resources for each alliance
        const allianceData = await Promise.all(alliances.map(async (alliance) => {
            const contributions = await MemberContribution.findAll({
                where: { alliance_id: alliance.id }
            });

            let totalFood = 0;
            let totalWood = 0;
            let totalStone = 0;
            let totalGold = 0;

            contributions.forEach(contrib => {
                totalFood += parseInt(contrib.food) || 0;
                totalWood += parseInt(contrib.wood) || 0;
                totalStone += parseInt(contrib.stone) || 0;
                totalGold += parseInt(contrib.gold) || 0;
            });

            const totalRss = totalFood + totalWood + totalStone + totalGold;
            const memberCount = await User.count({
                where: { alliance_id: alliance.id }
            });

            return {
                id: alliance.id,
                name: alliance.name,
                tag: alliance.tag || 'N/A',
                leader: alliance.leader || 'N/A',
                members: memberCount,
                food: totalFood,
                wood: totalWood,
                stone: totalStone,
                gold: totalGold,
                totalRss: totalRss
            };
        }));

        // Sort by total RSS descending
        allianceData.sort((a, b) => b.totalRss - a.totalRss);

        res.json({
            success: true,
            message: `Displaying ${allianceData.length} alliances`,
            data: allianceData
        });

    } catch (error) {
        console.error('Error in test bank-alliance:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching alliance data',
            error: error.message
        });
    }
});

/**
 * GET /api/test/report-user/:userIdentifier
 * Test endpoint for /report-user command
 * Supports both username (name) and user ID
 * Example: /api/test/report-user/John%20Doe or /api/test/report-user/1
 */
router.get('/report-user/:userIdentifier', async (req, res) => {
    try {
        const userIdentifier = req.params.userIdentifier;
        let user;

        // Try to find user by ID first (if it's a number)
        const userId = parseInt(userIdentifier);
        if (!isNaN(userId)) {
            user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role', 'alliance_id']
            });
        }

        // If not found by ID, search by username (name column)
        if (!user) {
            user = await User.findOne({
                where: { name: userIdentifier },
                attributes: ['id', 'name', 'email', 'role', 'alliance_id']
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID/username "${userIdentifier}" not found`
            });
        }

        // Fetch user's alliance
        let allianceName = 'Not joined any alliance yet';
        if (user.alliance_id) {
            const alliance = await Alliance.findByPk(user.alliance_id);
            if (alliance) {
                allianceName = `${alliance.name} [${alliance.tag || 'N/A'}]`;
            }
        }

        // Fetch all contributions from this user
        const contributions = await MemberContribution.findAll({
            where: { member_id: user.id },
            order: [['week', 'ASC']]
        });

        if (!contributions || contributions.length === 0) {
            return res.json({
                success: true,
                message: 'User has no contribution history',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    alliance: allianceName
                },
                contributions: [],
                summary: {
                    totalWeeks: 0,
                    totalFood: 0,
                    totalWood: 0,
                    totalStone: 0,
                    totalGold: 0,
                    totalRss: 0
                }
            });
        }

        // Calculate totals
        let totalFood = 0;
        let totalWood = 0;
        let totalStone = 0;
        let totalGold = 0;
        let totalRss = 0;

        contributions.forEach(contrib => {
            totalFood += parseInt(contrib.food) || 0;
            totalWood += parseInt(contrib.wood) || 0;
            totalStone += parseInt(contrib.stone) || 0;
            totalGold += parseInt(contrib.gold) || 0;
            totalRss += parseInt(contrib.total_rss) || 0;
        });

        // Format contributions
        const formattedContributions = contributions.map(contrib => ({
            week: contrib.week,
            date: contrib.date,
            food: contrib.food,
            wood: contrib.wood,
            stone: contrib.stone,
            gold: contrib.gold,
            total: contrib.total_rss
        }));

        res.json({
            success: true,
            message: `User report for ${user.name}`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                alliance: allianceName
            },
            contributions: formattedContributions,
            summary: {
                totalWeeks: contributions.length,
                totalFood: totalFood,
                totalWood: totalWood,
                totalStone: totalStone,
                totalGold: totalGold,
                totalRss: totalRss
            }
        });

    } catch (error) {
        console.error('Error in test report-user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user data',
            error: error.message
        });
    }
});

/**
 * GET /api/test/bank-rank
 * Test endpoint for /bank-rank command
 * Display top 10 users with the most RSS donations (Leaderboard)
 */
router.get('/bank-rank', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'alliance_id'],
            raw: true
        });

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users registered in the database'
            });
        }

        // Calculate total contributions for each user
        const userRankData = await Promise.all(users.map(async (user) => {
            const contributions = await MemberContribution.findAll({
                where: { member_id: user.id }
            });

            let totalRss = 0;
            let totalFood = 0;
            let totalWood = 0;
            let totalStone = 0;
            let totalGold = 0;
            let totalWeeks = 0;

            contributions.forEach(contrib => {
                totalRss += parseInt(contrib.total_rss) || 0;
                totalFood += parseInt(contrib.food) || 0;
                totalWood += parseInt(contrib.wood) || 0;
                totalStone += parseInt(contrib.stone) || 0;
                totalGold += parseInt(contrib.gold) || 0;
                totalWeeks += 1;
            });

            return {
                rank: 0, // Will be set after sorting
                id: user.id,
                name: user.name,
                totalRss: totalRss,
                food: totalFood,
                wood: totalWood,
                stone: totalStone,
                gold: totalGold,
                totalWeeks: totalWeeks,
                avgPerWeek: totalWeeks > 0 ? Math.floor(totalRss / totalWeeks) : 0
            };
        }));

        // Sort by total RSS descending
        userRankData.sort((a, b) => b.totalRss - a.totalRss);

        // Add rank numbers
        userRankData.forEach((user, index) => {
            user.rank = index + 1;
        });

        // Get top 10
        const topUsers = userRankData.slice(0, 10);

        if (topUsers.length === 0 || topUsers[0].totalRss === 0) {
            return res.json({
                success: true,
                message: 'No users with RSS contributions yet',
                data: []
            });
        }

        res.json({
            success: true,
            message: `Displaying top ${topUsers.length} donors`,
            totalUsers: users.length,
            timestamp: new Date().toISOString(),
            data: topUsers.map(user => ({
                rank: user.rank,
                name: user.name,
                id: user.id,
                rss: {
                    food: user.food,
                    wood: user.wood,
                    stone: user.stone,
                    gold: user.gold,
                    total: user.totalRss
                },
                statistics: {
                    weeksContributed: user.totalWeeks,
                    averagePerWeek: user.avgPerWeek
                }
            }))
        });

    } catch (error) {
        console.error('Error in test bank-rank:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching ranking data',
            error: error.message
        });
    }
});

/**
 * GET /api/test/bank-list
 * Test endpoint to list available banks
 * Display all registered bank names in the database
 */
router.get('/bank-list', async (req, res) => {
    try {
        // Fetch all unique bank names
        const alliances = await Alliance.findAll({
            attributes: ['bank_name'],
            where: {
                bank_name: {
                    [Op.not]: null
                }
            },
            raw: true
        });

        if (!alliances || alliances.length === 0) {
            return res.json({
                success: true,
                message: 'No banks registered',
                data: [],
                fallbackOptions: [
                    { name: 'Kingdom Bank', value: 'Kingdom Bank' },
                    { name: 'Alliance Bank', value: 'Alliance Bank' },
                    { name: 'General Bank', value: 'General Bank' }
                ]
            });
        }

        // Remove duplicates and get unique banks
        const uniqueBanks = [...new Set(alliances.map(a => a.bank_name))];
        const bankChoices = uniqueBanks.map(bankName => ({
            name: bankName,
            value: bankName
        }));

        res.json({
            success: true,
            message: `Displaying ${bankChoices.length} registered banks`,
            totalBanks: bankChoices.length,
            data: bankChoices
        });

    } catch (error) {
        console.error('Error in test bank-list:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching bank data',
            error: error.message
        });
    }
});

/**
 * GET /api/test/download-report
 * Test endpoint for /download-report command
 * Generate and download Excel report
 */
router.get('/download-report', async (req, res) => {
    try {
        // Alliance selection: by id, name, or tag
        const allianceId = req.query.alliance_id;
        const allianceName = req.query.alliance_name;
        const allianceTag = req.query.alliance_tag;

        let alliance;
        if (allianceId) {
            alliance = await Alliance.findByPk(allianceId);
        } else if (allianceName) {
            alliance = await Alliance.findOne({ where: { name: allianceName } });
        } else if (allianceTag) {
            alliance = await Alliance.findOne({ where: { tag: allianceTag } });
        }

        if (!alliance) {
            return res.status(404).json({
                success: false,
                message: 'Alliance not found. Please provide a valid alliance_id, alliance_name, or alliance_tag.'
            });
        }

        // Fetch all members in the alliance
        const members = await User.findAll({
            where: { alliance_id: alliance.id },
            attributes: ['id', 'name'],
            raw: true
        });

        if (!members || members.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No members in this alliance.'
            });
        }

        // Calculate total contributions for each member
        const memberData = await Promise.all(members.map(async (member) => {
            const contributions = await MemberContribution.findAll({
                where: { member_id: member.id, alliance_id: alliance.id }
            });

            let totalRss = 0;
            let totalFood = 0;
            let totalWood = 0;
            let totalStone = 0;
            let totalGold = 0;
            let totalWeeks = 0;

            contributions.forEach(contrib => {
                totalRss += parseInt(contrib.total_rss) || 0;
                totalFood += parseInt(contrib.food) || 0;
                totalWood += parseInt(contrib.wood) || 0;
                totalStone += parseInt(contrib.stone) || 0;
                totalGold += parseInt(contrib.gold) || 0;
                totalWeeks += 1;
            });

            return {
                rank: 0,
                id: member.id,
                name: member.name,
                totalRss: totalRss,
                food: totalFood,
                wood: totalWood,
                stone: totalStone,
                gold: totalGold,
                totalWeeks: totalWeeks,
                avgPerWeek: totalWeeks > 0 ? Math.floor(totalRss / totalWeeks) : 0
            };
        }));

        // Sort by total RSS descending
        memberData.sort((a, b) => b.totalRss - a.totalRss);

        // Add rank numbers
        memberData.forEach((member, index) => {
            member.rank = index + 1;
        });

        // Generate Excel report for all members (no slice/top 10)
        console.log(`📊 Generating Excel report for alliance ${alliance.name}...`);
        const reportInfo = await generateBankRankReport(memberData, alliance.name);

        res.json({
            success: true,
            message: `Excel report for alliance ${alliance.name} has been successfully created`,
            data: {
                filename: reportInfo.filename,
                filepath: reportInfo.filepath,
                url: reportInfo.url,
                totalMembers: memberData.length,
                totalRss: memberData.reduce((sum, m) => sum + m.totalRss, 0),
                downloadUrl: `http://localhost:3001${reportInfo.url}`,
                members: memberData // Add all member data to response if needed
            }
        });

    } catch (error) {
        console.error('Error in test download-report:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the Excel report',
            error: error.message
        });
    }
});

/**
 * GET /api/test/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bot test server is running',
        timestamp: new Date().toISOString(),
        testMode: true
    });
});

export default router;
