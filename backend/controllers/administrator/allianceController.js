import { Alliance, AllianceResource } from "../../models/allianceModel.js";
import { User } from "../../models/index.js";
import MemberContribution from "../../models/memberContributionModel.js";
import AuditLogger from "../../utils/auditLogger.js";
import { Op } from "sequelize";

// Get all alliances with resources
export const getAlliances = async (req, res) => {
    try {
        const alliances = await Alliance.findAll({
            order: [['created_at', 'DESC']]
        });

        // Transform data to include calculated resources from contributions
        const formattedAlliances = await Promise.all(alliances.map(async (alliance) => {
            const allianceData = alliance.toJSON();
            
            // Calculate total resources from member contributions
            const contributions = await MemberContribution.findAll({
                where: { alliance_id: allianceData.id }
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

            return {
                id: allianceData.id,
                name: allianceData.name,
                tag: allianceData.tag,
                leader: allianceData.leader,
                members_count: allianceData.members_count,
                description: allianceData.description,
                food: totalFood,
                wood: totalWood,
                stone: totalStone,
                gold: totalGold,
                total_rss: totalRss,
                weeks_donated: allianceData.weeks_donated || 0,
                created_at: allianceData.created_at,
                updated_at: allianceData.updated_at
            };
        }));

        res.status(200).json(formattedAlliances);
    } catch (error) {
        console.error("Get alliances error:", error);
        res.status(500).json({ 
            msg: "Failed to retrieve alliances",
            error: error.message 
        });
    }
};

// Get single alliance by ID
export const getAllianceById = async (req, res) => {
    try {
        const { id } = req.params;

        const alliance = await Alliance.findByPk(id);

        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Calculate total resources from member contributions
        const contributions = await MemberContribution.findAll({
            where: { alliance_id: id }
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

        const allianceData = alliance.toJSON();

        const formattedAlliance = {
            id: allianceData.id,
            name: allianceData.name,
            tag: allianceData.tag,
            leader: allianceData.leader,
            members_count: allianceData.members_count,
            description: allianceData.description,
            food: totalFood,
            wood: totalWood,
            stone: totalStone,
            gold: totalGold,
            total_rss: totalRss,
            weeks_donated: allianceData.weeks_donated || 0,
            created_at: allianceData.created_at,
            updated_at: allianceData.updated_at
        };

        res.status(200).json(formattedAlliance);
    } catch (error) {
        console.error("Get alliance by ID error:", error);
        res.status(500).json({ 
            msg: "Failed to retrieve alliance",
            error: error.message 
        });
    }
};

// Create new alliance
export const createAlliance = async (req, res) => {
    try {
        const { name, tag, leader, description, food, wood, stone, gold } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ msg: "Alliance name is required" });
        }

        if (!leader || !leader.trim()) {
            return res.status(400).json({ msg: "Leader name is required" });
        }

        // Check if alliance name already exists
        const existingAlliance = await Alliance.findOne({ where: { name: name.trim() } });
        if (existingAlliance) {
            return res.status(409).json({ msg: "Alliance name already exists" });
        }

        // Create alliance
        const alliance = await Alliance.create({
            name: name.trim(),
            tag: tag || null,
            leader: leader.trim(),
            description: description?.trim() || null,
            members_count: 0
        });

        // Parse resource values (default to 0 if not provided)
        const foodValue = parseInt(food) || 0;
        const woodValue = parseInt(wood) || 0;
        const stoneValue = parseInt(stone) || 0;
        const goldValue = parseInt(gold) || 0;
        const totalRss = foodValue + woodValue + stoneValue + goldValue;

        // Create alliance resources
        await AllianceResource.create({
            alliance_id: alliance.id,
            food: foodValue,
            wood: woodValue,
            stone: stoneValue,
            gold: goldValue,
            total_rss: totalRss,
            weeks_donated: 0
        });

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'CREATE',
            'alliances',
            alliance.id,
            `Created alliance: ${alliance.name}`,
            req
        );

        // Fetch created alliance with resources
        const createdAlliance = await Alliance.findByPk(alliance.id, {
            include: [{
                model: AllianceResource,
                as: 'resources'
            }]
        });

        res.status(201).json({
            msg: "Alliance created successfully",
            alliance: createdAlliance
        });
    } catch (error) {
        console.error("Create alliance error:", error);
        res.status(500).json({ 
            msg: "Failed to create alliance",
            error: error.message 
        });
    }
};

// Update alliance
export const updateAlliance = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tag, leader, description } = req.body;

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ msg: "Alliance name is required" });
        }

        if (!leader || !leader.trim()) {
            return res.status(400).json({ msg: "Leader name is required" });
        }

        // Check if new name conflicts with existing alliance (excluding current)
        if (name.trim() !== alliance.name) {
            const existingAlliance = await Alliance.findOne({ 
                where: { name: name.trim() } 
            });
            if (existingAlliance && existingAlliance.id !== alliance.id) {
                return res.status(409).json({ msg: "Alliance name already exists" });
            }
        }

        // Update alliance (not resources)
        await alliance.update({
            name: name.trim(),
            tag: tag || null,
            leader: leader.trim(),
            description: description?.trim() || null
        });

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'UPDATE',
            'alliances',
            alliance.id,
            `Updated alliance: ${alliance.name}`,
            req
        );

        // Fetch updated alliance with resources
        const updatedAlliance = await Alliance.findByPk(id, {
            include: [{
                model: AllianceResource,
                as: 'resources'
            }]
        });

        res.status(200).json({
            msg: "Alliance updated successfully",
            alliance: updatedAlliance
        });
    } catch (error) {
        console.error("Update alliance error:", error);
        res.status(500).json({ 
            msg: "Failed to update alliance",
            error: error.message 
        });
    }
};

// Delete alliance
export const deleteAlliance = async (req, res) => {
    try {
        const { id } = req.params;

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        const allianceName = alliance.name;

        // Delete alliance (cascade will delete resources)
        await alliance.destroy();

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'DELETE',
            'alliances',
            id,
            `Deleted alliance: ${allianceName}`,
            req
        );

        res.status(200).json({ msg: "Alliance deleted successfully" });
    } catch (error) {
        console.error("Delete alliance error:", error);
        res.status(500).json({ 
            msg: "Failed to delete alliance",
            error: error.message 
        });
    }
};

// Update alliance resources
export const updateAllianceResources = async (req, res) => {
    try {
        const { id } = req.params;
        const { food, wood, stone, gold } = req.body;

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Get or create resources
        let resources = await AllianceResource.findOne({ where: { alliance_id: id } });
        
        const foodValue = parseInt(food) || 0;
        const woodValue = parseInt(wood) || 0;
        const stoneValue = parseInt(stone) || 0;
        const goldValue = parseInt(gold) || 0;
        const totalRss = foodValue + woodValue + stoneValue + goldValue;

        if (resources) {
            await resources.update({
                food: foodValue,
                wood: woodValue,
                stone: stoneValue,
                gold: goldValue,
                total_rss: totalRss
            });
        } else {
            resources = await AllianceResource.create({
                alliance_id: id,
                food: foodValue,
                wood: woodValue,
                stone: stoneValue,
                gold: goldValue,
                total_rss: totalRss,
                weeks_donated: 0
            });
        }

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'UPDATE',
            'alliance_resources',
            resources.id,
            `Updated resources for alliance: ${alliance.name}`,
            req
        );

        res.status(200).json({
            msg: "Alliance resources updated successfully",
            resources
        });
    } catch (error) {
        console.error("Update alliance resources error:", error);
        res.status(500).json({ 
            msg: "Failed to update alliance resources",
            error: error.message 
        });
    }
};

// Get alliance members with contributions
export const getAllianceMembers = async (req, res) => {
    try {
        const { id } = req.params;

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Get all member contributions for this alliance
        const contributions = await MemberContribution.findAll({
            where: { alliance_id: id },
            include: [{
                model: User,
                as: 'member',
                attributes: ['id', 'user_id', 'name', 'email']
            }],
            order: [['member_id', 'ASC'], ['week', 'DESC']]
        });

        // Aggregate contributions by member WITH individual contribution records
        const memberMap = {};
        contributions.forEach(contrib => {
            const memberId = contrib.member_id;
            if (!memberMap[memberId]) {
                memberMap[memberId] = {
                    id: contrib.member?.id || memberId,
                    member_id: memberId,
                    name: contrib.member?.name || 'Unknown',
                    governor_id: contrib.member?.user_id || '',
                    email: contrib.member?.email || '',
                    food: 0,
                    wood: 0,
                    stone: 0,
                    gold: 0,
                    total_rss: 0,
                    weeks_donated: 0,
                    last_contribution: null,
                    contributions: [] // Add array untuk weekly breakdown
                };
            }

            memberMap[memberId].food += parseInt(contrib.food) || 0;
            memberMap[memberId].wood += parseInt(contrib.wood) || 0;
            memberMap[memberId].stone += parseInt(contrib.stone) || 0;
            memberMap[memberId].gold += parseInt(contrib.gold) || 0;
            
            // Calculate total_rss from resources
            const contribTotal = (parseInt(contrib.food) || 0) + 
                                (parseInt(contrib.wood) || 0) + 
                                (parseInt(contrib.stone) || 0) + 
                                (parseInt(contrib.gold) || 0);
            memberMap[memberId].total_rss += contribTotal;
            memberMap[memberId].weeks_donated += 1;
            
            if (!memberMap[memberId].last_contribution || 
                new Date(contrib.created_at) > new Date(memberMap[memberId].last_contribution)) {
                memberMap[memberId].last_contribution = contrib.created_at;
            }

            // Add individual contribution to array
            const contribFood = parseInt(contrib.food) || 0;
            const contribWood = parseInt(contrib.wood) || 0;
            const contribStone = parseInt(contrib.stone) || 0;
            const contribGold = parseInt(contrib.gold) || 0;
            
            memberMap[memberId].contributions.push({
                id: contrib.id,
                week: contrib.week,
                date: contrib.date,
                food: contribFood,
                wood: contribWood,
                stone: contribStone,
                gold: contribGold,
                total_rss: contribFood + contribWood + contribStone + contribGold,
                created_at: contrib.created_at,
                updated_at: contrib.updated_at
            });
        });

        const members = Object.values(memberMap);
        res.status(200).json(members);
    } catch (error) {
        console.error("Get alliance members error:", error);
        res.status(500).json({ 
            msg: "Failed to retrieve alliance members",
            error: error.message 
        });
    }
};

// Get users not in alliance (available to add)
export const getAvailableUsers = async (req, res) => {
    try {
        const { id } = req.params;

        // Get all users who have contributed to this alliance
        const existingContributions = await MemberContribution.findAll({
            where: { alliance_id: id },
            attributes: ['member_id'],
            group: ['member_id']
        });

        const existingMemberIds = existingContributions.map(c => c.member_id);

        // Get users not in this alliance
        const availableUsers = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: existingMemberIds.length > 0 ? existingMemberIds : [0]
                }
            },
            attributes: ['id', 'user_id', 'name', 'email'],
            order: [['name', 'ASC']]
        });

        res.status(200).json(availableUsers);
    } catch (error) {
        console.error("Get available users error:", error);
        res.status(500).json({ 
            msg: "Failed to retrieve available users",
            error: error.message 
        });
    }
};

// Add member to alliance (create initial contribution)
export const addMemberToAlliance = async (req, res) => {
    try {
        const { id } = req.params;
        const { member_ids } = req.body;

        if (!member_ids || !Array.isArray(member_ids) || member_ids.length === 0) {
            return res.status(400).json({ msg: "member_ids array is required" });
        }

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Create initial contributions for each member
        const currentDate = new Date();
        const currentWeek = Math.ceil((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

        const contributions = member_ids.map(memberId => ({
            member_id: memberId,
            alliance_id: id,
            week: currentWeek,
            date: currentDate.toISOString().split('T')[0],
            food: 0,
            wood: 0,
            stone: 0,
            gold: 0,
            total_rss: 0,
            last_contribution: currentDate
        }));

        await MemberContribution.bulkCreate(contributions);

        // Update alliance members count
        const memberCount = await MemberContribution.count({
            where: { alliance_id: id },
            distinct: true,
            col: 'member_id'
        });

        await alliance.update({ members_count: memberCount });

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'CREATE',
            'member_contributions',
            id,
            `Added ${member_ids.length} member(s) to alliance: ${alliance.name}`,
            req
        );

        res.status(200).json({
            msg: "Members added successfully",
            count: member_ids.length
        });
    } catch (error) {
        console.error("Add member to alliance error:", error);
        res.status(500).json({ 
            msg: "Failed to add members",
            error: error.message 
        });
    }
};

// Remove member from alliance
export const removeMemberFromAlliance = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        const alliance = await Alliance.findByPk(id);
        if (!alliance) {
            return res.status(404).json({ msg: "Alliance not found" });
        }

        // Delete all contributions for this member in this alliance
        await MemberContribution.destroy({
            where: {
                alliance_id: id,
                member_id: memberId
            }
        });

        // Update alliance members count
        const memberCount = await MemberContribution.count({
            where: { alliance_id: id },
            distinct: true,
            col: 'member_id'
        });

        await alliance.update({ members_count: memberCount });

        // Audit log
        await AuditLogger.log(
            req.session?.user?.id || null,
            'DELETE',
            'member_contributions',
            id,
            `Removed member ${memberId} from alliance: ${alliance.name}`,
            req
        );

        res.status(200).json({ msg: "Member removed successfully" });
    } catch (error) {
        console.error("Remove member from alliance error:", error);
        res.status(500).json({ 
            msg: "Failed to remove member",
            error: error.message 
        });
    }
};
