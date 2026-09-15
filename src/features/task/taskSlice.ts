import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export interface Task {
  _id?: string;
  id?: string;
  taskName: string;
  description: string;
  project: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  dueDate: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};


export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tasks/my-tasks");
      const data = response.data.data || response.data.tasks || response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);


export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData: Omit<Task, "_id">, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tasks/addTask", taskData);
      const data = response.data.data || response.data.task || response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);


export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tasks/updateTask", payload);
      const data = response.data.data || response.data.task || response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);


export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/tasks/deleteTask/${taskId}`);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTask.pending, (state) => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(editTask.pending, (state) => {
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id || t.id === action.payload.id,
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(
          (t) => t._id !== action.payload && t.id !== action.payload,
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
