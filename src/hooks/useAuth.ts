import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { login, changePassword, updateLocale } from "../api/authApi";
import type { LoginCredentials, SessionUser } from "../types/user";
import type { ChangePasswordRequest } from "../api/authApi";

export function useLogin() {
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (result, variables) => {
      const sessionUser: SessionUser = {
        username: variables.username,
        displayName: result.displayName,
        initials: result.displayName.slice(0, 1).toUpperCase(),
        roles: result.roles,
        permissions: result.permissions,
        preferredLocale: result.preferredLocale,
      };
      storeLogin(sessionUser, result.token);
      navigate("/dashboard");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => changePassword(request),
  });
}

export function useUpdateLocale() {
  return useMutation({
    mutationFn: (locale: string) => updateLocale(locale),
  });
}
