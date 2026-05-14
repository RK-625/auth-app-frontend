import * as z from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(15, "Password cannot exceed 15 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, "Code must be 6 digits").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  // Only validate matching if both are provided (Step 3)
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
    // Manually apply password rules if password is provided
    if (data.password && data.password.length > 0) {
        return data.password.length >= 6 && data.password.length <= 15;
    }
    return true;
}, {
    message: "Password must be 6-15 characters",
    path: ["password"]
});

// Forget schema shares the exact same structure as signup for step-based validation
export const forgetSchema = signupSchema;
