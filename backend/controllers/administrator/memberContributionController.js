import MemberContribution from "../../models/memberContributionModel.js";
import { User } from "../../models/index.js";
import { Alliance } from "../../models/allianceModel.js";
import AuditLogger from "../../utils/auditLogger.js";

// Get week number from date
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Create member contribution
export const createMemberContribution = async (req, res) => {
  try {
    const { member_id, alliance_id, date, week, food, wood, stone, gold } = req.body;

    // Validate required fields
    if (!member_id || !alliance_id || !date) {
      return res.status(400).json({ msg: 'Member ID, Alliance ID, and Date are required' });
    }

    // Verify member exists
    const member = await User.findByPk(member_id);
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    // Verify alliance exists
    const alliance = await Alliance.findByPk(alliance_id);
    if (!alliance) {
      return res.status(404).json({ msg: 'Alliance not found' });
    }

    // Calculate week number - use provided week if given and valid, otherwise calculate from date
    const contributionDate = new Date(date);
    let weekNumber = week;
    if (!weekNumber || weekNumber < 1 || weekNumber > 100) {
      weekNumber = getWeekNumber(contributionDate);
    }

    // Enforce sequential weeks: cannot skip previous weeks unless updating an existing week
    const existingWeeksRaw = await MemberContribution.findAll({
      where: { member_id, alliance_id },
      attributes: ['week'],
    });

    const existingWeeks = existingWeeksRaw.map((row) => parseInt(row.week)).filter(Boolean);
    const isExistingWeek = existingWeeks.includes(weekNumber);

    if (!isExistingWeek) {
      const sorted = [...new Set(existingWeeks)].sort((a, b) => a - b);
      let expected = 1;
      for (const wk of sorted) {
        if (wk === expected) {
          expected += 1;
        } else if (wk > expected) {
          break; // gap found
        }
      }

      if (weekNumber !== expected) {
        return res.status(400).json({
          msg: `You must fill Week ${expected} before adding Week ${weekNumber}`,
        });
      }
    }

    // Calculate total RSS
    const totalRss = (parseInt(food) || 0) + (parseInt(wood) || 0) + (parseInt(stone) || 0) + (parseInt(gold) || 0);

    // Create or update contribution
    const [contribution, created] = await MemberContribution.findOrCreate({
      where: {
        member_id,
        alliance_id,
        week: weekNumber,
      },
      defaults: {
        date: contributionDate,
        food: parseInt(food) || 0,
        wood: parseInt(wood) || 0,
        stone: parseInt(stone) || 0,
        gold: parseInt(gold) || 0,
      },
    });

    // If not created (already exists), update it
    if (!created) {
      await contribution.update({
        date: contributionDate,
        food: parseInt(food) || 0,
        wood: parseInt(wood) || 0,
        stone: parseInt(stone) || 0,
        gold: parseInt(gold) || 0,
      });
    }

    // Log activity
    await AuditLogger.log(req.user.id, 'CREATE', 'member_contributions', contribution.id, `Added ${totalRss.toLocaleString()} RSS contribution for ${member.name} in Week ${weekNumber}`);

    res.status(201).json({
      msg: 'Member contribution recorded successfully',
      data: contribution,
    });
  } catch (err) {
    console.error('Create member contribution error:', err);
    res.status(500).json({ msg: err.message || 'Failed to create member contribution' });
  }
};

// Get member contributions by alliance
export const getMemberContributionsByAlliance = async (req, res) => {
  try {
    const { allianceId } = req.params;
    const { memberId, week } = req.query;

    const whereClause = { alliance_id: allianceId };
    if (memberId) whereClause.member_id = memberId;
    if (week) whereClause.week = week;

    const contributions = await MemberContribution.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'name', 'email', 'user_id'],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.status(200).json(contributions);
  } catch (err) {
    console.error('Get member contributions error:', err);
    res.status(500).json({ msg: err.message || 'Failed to fetch contributions' });
  }
};

// Update member contribution
export const updateMemberContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { food, wood, stone, gold } = req.body;

    const contribution = await MemberContribution.findByPk(id);
    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }

    const oldData = {
      food: contribution.food,
      wood: contribution.wood,
      stone: contribution.stone,
      gold: contribution.gold,
    };

    await contribution.update({
      food: parseInt(food) ?? contribution.food,
      wood: parseInt(wood) ?? contribution.wood,
      stone: parseInt(stone) ?? contribution.stone,
      gold: parseInt(gold) ?? contribution.gold,
    });

    // Log activity
    const newTotal = contribution.food + contribution.wood + contribution.stone + contribution.gold;
    const oldTotal = oldData.food + oldData.wood + oldData.stone + oldData.gold;
    await AuditLogger.log(req.user.id, 'UPDATE', 'member_contributions', id, `Updated RSS from ${oldTotal.toLocaleString()} to ${newTotal.toLocaleString()}`);

    res.status(200).json({
      msg: 'Contribution updated successfully',
      data: contribution,
    });
  } catch (err) {
    console.error('Update member contribution error:', err);
    res.status(500).json({ msg: err.message || 'Failed to update contribution' });
  }
};

// Delete member contribution
export const deleteMemberContribution = async (req, res) => {
  try {
    const { id, memberId, allianceId, week } = req.params;

    let contribution;
    
    // If memberId, allianceId, and week provided, delete by those parameters
    if (memberId && allianceId && week) {
      contribution = await MemberContribution.findOne({
        where: {
          member_id: memberId,
          alliance_id: allianceId,
          week: parseInt(week)
        }
      });
    } else if (id) {
      // Delete by ID
      contribution = await MemberContribution.findByPk(id);
    }

    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }

    const totalRss = contribution.food + contribution.wood + contribution.stone + contribution.gold;
    const weekNumber = contribution.week;
    const memberName = memberId || 'Member';

    await contribution.destroy();

    // Log activity
    await AuditLogger.log(req.user.id, 'DELETE', 'member_contributions', contribution.id, `Deleted ${totalRss.toLocaleString()} RSS contribution for Week ${weekNumber} from ${memberName}`);

    res.status(200).json({ msg: 'Contribution deleted successfully' });
  } catch (err) {
    console.error('Delete member contribution error:', err);
    res.status(500).json({ msg: err.message || 'Failed to delete contribution' });
  }
};
