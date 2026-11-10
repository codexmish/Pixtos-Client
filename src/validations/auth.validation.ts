import z from "zod";

// -----user signup validation
export const userSignupSchema = z.object({
	name: z.string("Name is required").min(3, "name must be 3 caracters long"),

	email: z.email("Invalid email address").toLowerCase(),
	password: z
		.string("Password is required")
		.min(8, "password must be 8 caracters long")
		.max(32, "password max 32 caracters long"),
});

// -----otp validation
export const otpVerifySchema = z.object({
	email: z.email("Invalid email address").toLowerCase(),
	otp: z
		.string("otp is required")
		.min(6, "otp must be 6 caracters long")
		.max(6, "otp max 6 caracters long"),
});

// -----forget password validation
export const forgetPasswordSchema = z.object({
	email: z.email("Invalid email address").toLowerCase(),
});

// -----reset password validation
export const resetPasswordSchema = z
	.object({
		otp: z
			.string("otp is required")
			.min(6, "otp must be 6 caracters long")
			.max(6, "otp max 6 caracters long"),
		newPassword: z
			.string("New password is required")
			.min(8, "password must be 8 caracters long")
			.max(32, "password max 32 caracters long"),
		confirmPassword: z.string("Please confirm your password"),
	})
	// ----both password fields must match
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// ------user signin validation
export const userSignInSchema = z.object({
	email: z.email("Invalid email address").toLowerCase(),
	password: z
		.string("Password is required")
		.min(8, "password must be 8 caracters long")
		.max(32, "password max 32 caracters long"),
});