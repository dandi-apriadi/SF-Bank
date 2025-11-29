import { Faculty, Department, StudyProgram, UserProgramRole } from '../../models/index.js';
import { createCrudController } from '../shared/crudFactory.js';

export const facultyController = createCrudController(Faculty, { searchFields: ['name','code'] });
export const departmentController = createCrudController(Department, { searchFields: ['name','code'] });
export const studyProgramController = createCrudController(StudyProgram, { searchFields: ['name','code'] });
export const userProgramRoleController = createCrudController(UserProgramRole, { searchFields: ['role'] });
