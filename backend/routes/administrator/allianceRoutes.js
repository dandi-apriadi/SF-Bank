import express from 'express';
import {
    getAlliances,
    getAllianceById,
    createAlliance,
    updateAlliance,
    deleteAlliance,
    updateAllianceResources,
    getAllianceMembers,
    getAvailableUsers,
    addMemberToAlliance,
    removeMemberFromAlliance
} from '../../controllers/administrator/allianceController.js';
import {
    createMemberContribution,
    getMemberContributionsByAlliance,
    updateMemberContribution,
    deleteMemberContribution
} from '../../controllers/administrator/memberContributionController.js';
import { getReportsSummary } from '../../controllers/administrator/reportController.js';
import { authenticate, authorize } from '../../middleware/AuthUser.js';

const router = express.Router();

// All alliance routes require authentication
router.use(authenticate);

// Get all alliances
router.get('/alliances', getAlliances);

// Get single alliance by ID
router.get('/alliances/:id', getAllianceById);

// Get alliance members with contributions
router.get('/alliances/:id/members', getAllianceMembers);

// Get users available to add to alliance
router.get('/alliances/:id/available-users', getAvailableUsers);

// Add members to alliance (admin only)
router.post('/alliances/:id/members', authorize(['Admin']), addMemberToAlliance);

// Remove member from alliance (admin only)
router.delete('/alliances/:id/members/:memberId', authorize(['Admin']), removeMemberFromAlliance);

// Create new alliance (admin only)
router.post('/alliances', authorize(['Admin']), createAlliance);

// Update alliance (admin only)
router.put('/alliances/:id', authorize(['Admin']), updateAlliance);

// Delete alliance (admin only)
router.delete('/alliances/:id', authorize(['Admin']), deleteAlliance);

// Update alliance resources (admin only)
router.put('/alliances/:id/resources', authorize(['Admin']), updateAllianceResources);

// Member Contributions Routes
// Create member contribution (requires authentication)
router.post('/member-contributions', createMemberContribution);

// Get contributions by alliance
router.get('/alliances/:allianceId/contributions', getMemberContributionsByAlliance);

// Update member contribution (requires authentication)
router.put('/member-contributions/:id', updateMemberContribution);

// Delete member contribution by ID
router.delete('/member-contributions/:id', deleteMemberContribution);

// Delete member contribution by memberId, allianceId, and week
router.delete('/member-contributions/:memberId/:allianceId/:week', deleteMemberContribution);

// Reports summary (aggregated data for frontend Reports page)
router.get('/reports/summary', getReportsSummary);

export default router;
