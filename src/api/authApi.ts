import axiosInstance from './axiosInstance';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../features/auth/authTypes';

export const loginUserApi = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const registerUserApi = async (userData: RegisterPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const logoutUserApi = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const checkAuthApi = async (): Promise<{ user: User }> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};


export const forgotPasswordApi = async (email: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};


export const changePasswordApi = async (passwordData: any): Promise<{ message: string }> => {
  const response = await axiosInstance.patch('/auth/changePassword', passwordData);
  return response.data;
};

export const updateUserApi = async (userData: any): Promise<any> => {
  const response = await axiosInstance.patch('/auth/updateUser', userData);
  return response.data;
};

export const getAllUsersApi = async () => {
  return await axiosInstance.get("/auth/getAllUsers");
};