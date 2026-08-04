import axiosInstance from "../api/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

const AUTH_URL = import.meta.env.VITE_AUTH_API;

export const login = async (
  request: LoginRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(
    `${AUTH_URL}/api/auth/login`,
    request
  );

  return response.data;
};

export const register = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(
    `${AUTH_URL}/api/auth/register`,
    request
  );

  return response.data;
};