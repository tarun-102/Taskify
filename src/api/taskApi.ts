import axiosInstance from "./axiosInstance"; 

// Get All Tasks 
export const fetchTasksApi = async () => {
  const response = await axiosInstance.get("/tasks/my-tasks"); 
  return response.data;
};

//  Add Task 
export const addTaskApi = async (taskData: any) => {
  const response = await axiosInstance.post("/tasks/addTask", taskData);
  return response.data;
};

// Update Task 
export const updateTaskApi = async (taskData: any) => {
  const response = await axiosInstance.post("/tasks/updateTask", taskData);
  return response.data;
};

//  Delete Task 
export const deleteTaskApi = async (taskId: string) => {
  const response = await axiosInstance.post(`/tasks/deleteTask/${taskId}`);
  return response.data;
};