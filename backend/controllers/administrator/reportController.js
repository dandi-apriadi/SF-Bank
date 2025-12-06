import { Op } from 'sequelize';
import { MemberContribution, User, Alliance } from '../../models/index.js';

// GET /api/v1/reports/summary
// Returns aggregated data for reports page
export const getReportsSummary = async (req, res) => {
  try {
    const contributions = await MemberContribution.findAll({
      include: [
        { model: User, as: 'member', attributes: ['id', 'name', 'user_id', 'email', 'alliance_id'] },
        { model: Alliance, as: 'alliance', attributes: ['id', 'name', 'tag', 'members_count'] },
      ],
      order: [['date', 'DESC']],
    });

    // Aggregate by member
    const memberMap = {};
    // Aggregate by alliance
    const allianceMap = {};
    // Deposits list
    const deposits = [];

    contributions.forEach((c) => {
      const food = parseInt(c.food) || 0;
      const wood = parseInt(c.wood) || 0;
      const stone = parseInt(c.stone) || 0;
      const gold = parseInt(c.gold) || 0;
      const total = food + wood + stone + gold;
      const memberId = c.member_id;
      const allianceId = c.alliance_id;
      const memberName = c.member?.name || `Member ${memberId}`;
      const allianceName = c.alliance?.name || 'Alliance';
      const allianceTag = c.alliance?.tag || '';

      if (!memberMap[memberId]) {
        memberMap[memberId] = {
          id: memberId,
          governor_id: c.member?.user_id || '',
          name: memberName,
          alliance: allianceName,
          food: 0,
          wood: 0,
          stone: 0,
          gold: 0,
          total: 0,
          weeksPaidSet: new Set(),
        };
      }
      memberMap[memberId].food += food;
      memberMap[memberId].wood += wood;
      memberMap[memberId].stone += stone;
      memberMap[memberId].gold += gold;
      memberMap[memberId].total += total;
      memberMap[memberId].weeksPaidSet.add(parseInt(c.week) || 0);

      if (!allianceMap[allianceId]) {
        allianceMap[allianceId] = {
          id: allianceId,
          name: allianceName,
          tag: allianceTag,
          membersCount: c.alliance?.members_count || 0,
          food: 0,
          wood: 0,
          stone: 0,
          gold: 0,
        };
      }
      allianceMap[allianceId].food += food;
      allianceMap[allianceId].wood += wood;
      allianceMap[allianceId].stone += stone;
      allianceMap[allianceId].gold += gold;

      deposits.push({
        id: c.id,
        member: memberName,
        member_id: memberId,
        alliance: allianceName,
        week: c.week,
        date: c.date,
        food,
        wood,
        stone,
        gold,
        total,
      });
    });

    const members = Object.values(memberMap).map((m) => ({
      ...m,
      weeksPaid: Array.from(m.weeksPaidSet).filter((w) => w > 0).length,
    })).sort((a, b) => b.total - a.total);

    const alliances = Object.values(allianceMap).map((a) => ({
      ...a,
      total: a.food + a.wood + a.stone + a.gold,
    })).sort((a, b) => b.total - a.total);

    res.status(200).json({
      members,
      alliances,
      deposits,
    });
  } catch (error) {
    console.error('Get reports summary error:', error);
    res.status(500).json({ msg: 'Failed to fetch reports summary', error: error.message });
  }
};
