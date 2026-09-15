import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from "../features/projects/projectSlice"
import taskREducer from "../features/task/taskSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects : projectsReducer,
    tasks : taskREducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;