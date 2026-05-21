import client from "./client";
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
} from "../types/user";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/auth/login", credentials);
  return data;
}

export async function updateLocale(locale: string): Promise<void> {
  await client.patch("/auth/locale", { locale });
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export async function changePassword(
  request: ChangePasswordRequest,
): Promise<void> {
  await client.post("/auth/change-password", request);
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const { data } = await client.post<RefreshTokenResponse>("/auth/refresh");
  return data;
}
