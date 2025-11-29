import { Heatmap } from '../../models/index.js';
import { createCrudController } from '../shared/crudFactory.js';

// KPI removed; only heatmap analytics retained
export const heatmapController = createCrudController(Heatmap);
