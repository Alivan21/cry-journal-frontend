import z from "zod";
import type { SuccessResponse } from "@/common/types/base-response";

const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type RegisterRequest = z.infer<typeof registerSchema>;
type LoginRequest = z.infer<typeof loginSchema>;

type TUser = {
  id: string;
  email: string;
  name: string;
  roles: Array<string>;
};

type AuthResponseData = {
  accessToken: string;
  user: TUser;
};

type RegisterResponse = SuccessResponse<AuthResponseData>;

type LoginResponse = SuccessResponse<AuthResponseData>;

type LogoutResponse = SuccessResponse<{
  success: boolean;
}>;

type CurrentUserResponse = SuccessResponse<TUser>;

export {
  registerSchema,
  loginSchema,
  type RegisterRequest,
  type LoginRequest,
  type RegisterResponse,
  type LoginResponse,
  type LogoutResponse,
  type CurrentUserResponse,
};
