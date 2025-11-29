import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import accreditationReducer from "./slices/accreditationSlice";
import evidenceReducer from "./slices/evidenceSlice";
import progressReducer from "./slices/progressSlice";
import gapReducer from "./slices/gapSlice";
import notificationReducer from "./slices/notificationSlice";
import institutionReducer from "./slices/institutionSlice";
import projectionReducer from "./slices/projectionSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  accreditation: accreditationReducer,
  evidence: evidenceReducer,
  progress: progressReducer,
  gaps: gapReducer,
  notifications: notificationReducer,
  institution: institutionReducer,
  projection: projectionReducer,
  theme: themeReducer
  },
});
