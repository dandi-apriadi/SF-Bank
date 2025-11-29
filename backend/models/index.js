import { User } from "./userModel.js";
import { OrganizationModels } from "./organizationModels.js";
import { AccreditationModels } from "./accreditationModels.js";
import { DocumentModels } from "./documentModels.js";
import { EvaluationModels } from "./evaluationModels.js";
import { AnalyticsModels } from "./analyticsModels.js";
import { NotificationModels } from "./notificationModels.js";
import { IntegrationModels } from "./integrationModels.js";
import { NewsModels } from "./newsModels.js";
import { AuthExtraModels } from "./authExtraModels.js";

// Destructure grouped models for easier export
const {
    Faculty,
    Department,
    StudyProgram,
    UserProgramRole
} = OrganizationModels;

const {
    AccreditationCycle,
    AccreditationCriteria,
    CycleCriteriaProgress,
    Narrative,
    NarrativeVersion,
    Evidence,
    EvidenceTag,
    EvidenceVersion,
    AccreditationScore,
    ScoreSimulation
} = AccreditationModels;

const { DocumentTemplate, Document, DocumentVersion } = DocumentModels;

const {
    Evaluation,
    PpeppCycle,
    PpeppAction,
    FollowUpItem
} = EvaluationModels;

const { Heatmap, Kpi, QualityRisk, QualityRecommendation } = AnalyticsModels;

const { Notification, ActivityLog } = NotificationModels;

const {
    IntegrationSource,
    IntegrationJob,
    IntegrationJobLog,
    ReconciliationResult
} = IntegrationModels;

const { NewsPost, NewsAttachment } = NewsModels;

const { Session, PasswordReset } = AuthExtraModels;

// Associations (basic - can be extended as needed)

// Organization
Faculty.hasMany(StudyProgram, { foreignKey: 'faculty_id' });
StudyProgram.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Department.belongsTo(Faculty, { foreignKey: 'faculty_id' });
Faculty.hasMany(Department, { foreignKey: 'faculty_id' });

StudyProgram.hasMany(UserProgramRole, { foreignKey: 'study_program_id' });
UserProgramRole.belongsTo(StudyProgram, { foreignKey: 'study_program_id' });
User.hasMany(UserProgramRole, { foreignKey: 'user_id' });
UserProgramRole.belongsTo(User, { foreignKey: 'user_id' });

// User <-> StudyProgram direct optional relation (gunakan alias untuk hindari tabrakan nama dgn kolom 'study_program')
StudyProgram.hasMany(User, { foreignKey: 'study_program_id', as: 'users' });
User.belongsTo(StudyProgram, { foreignKey: 'study_program_id', as: 'studyProgramRef' });

// Accreditation
StudyProgram.hasMany(AccreditationCycle, { foreignKey: 'study_program_id' });
AccreditationCycle.belongsTo(StudyProgram, { foreignKey: 'study_program_id' });

AccreditationCycle.hasMany(CycleCriteriaProgress, { foreignKey: 'cycle_id' });
CycleCriteriaProgress.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
AccreditationCriteria.hasMany(CycleCriteriaProgress, { foreignKey: 'criteria_id' });
CycleCriteriaProgress.belongsTo(AccreditationCriteria, { foreignKey: 'criteria_id' });

AccreditationCycle.hasMany(Narrative, { foreignKey: 'cycle_id' });
Narrative.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
AccreditationCriteria.hasMany(Narrative, { foreignKey: 'criteria_id' });
Narrative.belongsTo(AccreditationCriteria, { foreignKey: 'criteria_id' });
User.hasMany(Narrative, { foreignKey: 'created_by' });
Narrative.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
Narrative.belongsTo(User, { as: 'updater', foreignKey: 'updated_by' });
Narrative.hasMany(NarrativeVersion, { foreignKey: 'narrative_id' });
NarrativeVersion.belongsTo(Narrative, { foreignKey: 'narrative_id' });
User.hasMany(NarrativeVersion, { foreignKey: 'changed_by' });
NarrativeVersion.belongsTo(User, { foreignKey: 'changed_by' });

AccreditationCycle.hasMany(Evidence, { foreignKey: 'cycle_id' });
Evidence.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
AccreditationCriteria.hasMany(Evidence, { foreignKey: 'criteria_id' });
Evidence.belongsTo(AccreditationCriteria, { foreignKey: 'criteria_id' });
User.hasMany(Evidence, { foreignKey: 'uploaded_by' });
Evidence.belongsTo(User, { foreignKey: 'uploaded_by' });
Evidence.hasMany(EvidenceTag, { foreignKey: 'evidence_id' });
EvidenceTag.belongsTo(Evidence, { foreignKey: 'evidence_id' });
Evidence.hasMany(EvidenceVersion, { foreignKey: 'evidence_id' });
EvidenceVersion.belongsTo(Evidence, { foreignKey: 'evidence_id' });
EvidenceVersion.belongsTo(User, { foreignKey: 'updated_by' });

AccreditationCycle.hasMany(AccreditationScore, { foreignKey: 'cycle_id' });
AccreditationScore.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
AccreditationCriteria.hasMany(AccreditationScore, { foreignKey: 'criteria_id' });
AccreditationScore.belongsTo(AccreditationCriteria, { foreignKey: 'criteria_id' });
User.hasMany(AccreditationScore, { foreignKey: 'evaluator_id' });
AccreditationScore.belongsTo(User, { foreignKey: 'evaluator_id' });

AccreditationCycle.hasMany(ScoreSimulation, { foreignKey: 'cycle_id' });
ScoreSimulation.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
User.hasMany(ScoreSimulation, { foreignKey: 'created_by' });
ScoreSimulation.belongsTo(User, { foreignKey: 'created_by' });

// Documents
DocumentTemplate.hasMany(Document, { foreignKey: 'template_id', as: 'documents' });
Document.belongsTo(DocumentTemplate, { foreignKey: 'template_id', as: 'template' });
StudyProgram.hasMany(Document, { foreignKey: 'study_program_id', as: 'documents' });
Document.belongsTo(StudyProgram, { foreignKey: 'study_program_id', as: 'study_program' });
User.hasMany(Document, { foreignKey: 'owner_user_id', as: 'owned_documents' });
Document.belongsTo(User, { foreignKey: 'owner_user_id', as: 'owner' });
Document.hasMany(DocumentVersion, { foreignKey: 'document_id' });
DocumentVersion.belongsTo(Document, { foreignKey: 'document_id' });
User.hasMany(DocumentVersion, { foreignKey: 'changed_by' });
DocumentVersion.belongsTo(User, { foreignKey: 'changed_by' });

// Evaluations & PPEPP
AccreditationCycle.hasMany(Evaluation, { foreignKey: 'cycle_id' });
Evaluation.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
AccreditationCriteria.hasMany(Evaluation, { foreignKey: 'criteria_id' });
Evaluation.belongsTo(AccreditationCriteria, { foreignKey: 'criteria_id' });
User.hasMany(Evaluation, { foreignKey: 'evaluator_id' });
Evaluation.belongsTo(User, { foreignKey: 'evaluator_id' });

StudyProgram.hasMany(PpeppCycle, { foreignKey: 'study_program_id' });
PpeppCycle.belongsTo(StudyProgram, { foreignKey: 'study_program_id' });
PpeppCycle.hasMany(PpeppAction, { foreignKey: 'ppepp_id' });
PpeppAction.belongsTo(PpeppCycle, { foreignKey: 'ppepp_id' });
User.hasMany(PpeppAction, { foreignKey: 'responsible_user_id', as: 'responsible_actions' });
PpeppAction.belongsTo(User, { foreignKey: 'responsible_user_id', as: 'responsible' });

AccreditationCycle.hasMany(FollowUpItem, { foreignKey: 'cycle_id' });
FollowUpItem.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
User.hasMany(FollowUpItem, { foreignKey: 'assigned_to' });
FollowUpItem.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
FollowUpItem.belongsTo(User, { as: 'verifier', foreignKey: 'verification_user_id' });

// Analytics (simplified - KPI removed)
AccreditationCycle.hasMany(Heatmap, { foreignKey: 'cycle_id' });
Heatmap.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
StudyProgram.hasMany(Heatmap, { foreignKey: 'study_program_id' });
Heatmap.belongsTo(StudyProgram, { foreignKey: 'study_program_id' });

// Notifications & Activity
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

// News
User.hasMany(NewsPost, { foreignKey: 'author_user_id' });
NewsPost.belongsTo(User, { foreignKey: 'author_user_id' });
NewsPost.hasMany(NewsAttachment, { foreignKey: 'news_id' });
NewsAttachment.belongsTo(NewsPost, { foreignKey: 'news_id' });

// Integrations
IntegrationSource.hasMany(IntegrationJob, { foreignKey: 'source_id' });
IntegrationJob.belongsTo(IntegrationSource, { foreignKey: 'source_id' });
IntegrationJob.hasMany(IntegrationJobLog, { foreignKey: 'job_id' });
IntegrationJobLog.belongsTo(IntegrationJob, { foreignKey: 'job_id' });
IntegrationSource.hasMany(ReconciliationResult, { foreignKey: 'source_id' });
ReconciliationResult.belongsTo(IntegrationSource, { foreignKey: 'source_id' });
AccreditationCycle.hasMany(ReconciliationResult, { foreignKey: 'cycle_id' });
ReconciliationResult.belongsTo(AccreditationCycle, { foreignKey: 'cycle_id' });
StudyProgram.hasMany(ReconciliationResult, { foreignKey: 'study_program_id' });
ReconciliationResult.belongsTo(StudyProgram, { foreignKey: 'study_program_id' });

// Auth extra
User.hasMany(Session, { foreignKey: 'user_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(PasswordReset, { foreignKey: 'user_id' });
PasswordReset.belongsTo(User, { foreignKey: 'user_id' });

export {
    // Core user
    User,
    // Organization
    Faculty,
    Department,
    StudyProgram,
    UserProgramRole,
    // Accreditation
    AccreditationCycle,
    AccreditationCriteria,
    CycleCriteriaProgress,
    Narrative,
    NarrativeVersion,
    Evidence,
    EvidenceTag,
    EvidenceVersion,
    AccreditationScore,
    ScoreSimulation,
    // Documents
    DocumentTemplate,
    Document,
    DocumentVersion,
    // Evaluation & PPEPP
    Evaluation,
    PpeppCycle,
    PpeppAction,
    FollowUpItem,
    // Analytics
    Heatmap,
    Kpi,
    QualityRisk,
    QualityRecommendation,
    // Notifications & Activity
    Notification,
    ActivityLog,
    // Integration
    IntegrationSource,
    IntegrationJob,
    IntegrationJobLog,
    ReconciliationResult,
    // News
    NewsPost,
    NewsAttachment,
    // Auth extras
    Session,
    PasswordReset
};
