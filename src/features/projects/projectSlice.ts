import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export interface Project {
  _id: string;
  projectName: string;
  description?: string;
  priority: string;
  status: string;
  members?: string[];
  dueDate: string;
  owner: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/projects/my-projects");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch projects",
    );
  }
});

// Add Project
export const addProject = createAsyncThunk<
  Project,
  Partial<Project>,
  { rejectValue: string }
>("projects/addProject", async (projectData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      "/projects/addProject",
      projectData,
    );
    return response.data.data.project || response.data.data;
  } catch (err: any) {
    const errorDetails = JSON.stringify(err.response?.data, null, 2);
    console.error("Validation Error Details:", errorDetails);
    return rejectWithValue(err.response?.data?.message || errorDetails);
  }
});

// Edit Project
export const editProject = createAsyncThunk<
  Project,
  Partial<Project> & { projectId: string },
  { rejectValue: string }
>("projects/editProject", async (projectData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      "/projects/updateProject",
      projectData,
    );
    return response.data.data.project || response.data.data;
  } catch (err: any) {
    const errorDetails = JSON.stringify(err.response?.data, null, 2);
    console.error("Validation Error Details:", errorDetails);
    return rejectWithValue(err.response?.data?.message || errorDetails);
  }
});

// Delete Project
export const deleteProject = createAsyncThunk<
  string,
  { projectId: string },
  { rejectValue: string }
>("projects/deleteProject", async (payload, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/projects/delete-Project/${payload.projectId}`);
    return payload.projectId;
  } catch (err: any) {
    const errorDetails = JSON.stringify(err.response?.data, null, 2);
    console.error("Delete Error Details:", errorDetails);
    return rejectWithValue(err.response?.data?.message || errorDetails);
  }
});

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.projects = action.payload;
        },
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })
      .addCase(
        addProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.projects.unshift(action.payload);
        },
      )
      .addCase(
        editProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          const index = state.projects.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.projects = state.projects.filter(
            (p) => p._id !== action.payload,
          );
        },
      );
  },
});

export default projectSlice.reducer;
