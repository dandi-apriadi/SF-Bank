import express from 'express';
import { Alliance } from '../../models/allianceModel.js';
import { User } from '../../models/index.js';
import MemberContribution from '../../models/memberContributionModel.js';
import { generateBankRankReport } from '../../../BANKBOT/utils/excelReportGenerator.js';
import { authenticate, authorize } from '../../middleware/AuthUser.js';

const router = express.Router();

// Protected route: Download full bank report for selected alliance
router.get('/alliances/:id/download-report', authenticate, authorize(['Admin', 'R4', 'R5']), async (req, res) => {
    try {
        const { id } = req.params;
        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ success: false, message: 'Aliansi tidak ditemukan.' });
        }
        // Fetch all members in the alliance
        const members = await User.findAll({
            where: { alliance_id: alliance.id },
            attributes: ['id', 'name'],
            raw: true
        });
        if (!members || members.length === 0) {
            return res.status(404).json({ success: false, message: 'Tidak ada member di aliansi ini.' });
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
        // Generate Excel report for all members
        const reportInfo = await generateBankRankReport(memberData, alliance.name);
        res.json({
            success: true,
            message: `Excel report untuk aliansi ${alliance.name} telah berhasil dibuat`,
            data: {
                filename: reportInfo.filename,
                filepath: reportInfo.filepath,
                url: reportInfo.url,
                totalMembers: memberData.length,
                totalRss: memberData.reduce((sum, m) => sum + m.totalRss, 0),
                downloadUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${reportInfo.url}`,
                members: memberData
            }
        });
    } catch (error) {
        console.error('Error in download-report:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membuat Excel report', error: error.message });
    }
});

export default router;
