import z from "zod";
import type { BaseResponse } from "@/common/types/base-response";

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

type AuthResponseData = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: Array<string>;
  };
};

type RegisterResponse = BaseResponse<AuthResponseData>;

type LoginResponse = BaseResponse<AuthResponseData>;

type LogoutResponse = BaseResponse<{
  success: boolean;
}>;

export {
  registerSchema,
  loginSchema,
  type RegisterRequest,
  type LoginRequest,
  type RegisterResponse,
  type LoginResponse,
  type LogoutResponse,
};
