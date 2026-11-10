import apiClient from "@/lib/apiClient";
import { IOtpVerify, IResetPassword, ISignIn, ISignup } from "@/types";

// user signup (server sends an otp to the email)
export function userSignup(payload: ISignup){
    return apiClient("/auth/signup", {method: "POST", body: payload})
}

// otp verify (creates the user and logs in)
export function userVerify(payload: IOtpVerify){
    return apiClient("/auth/otp-verify", {method: "POST", body: payload})
}

// resend otp (1 minute cooldown in backend)
export function resendOtp(email: string){
    return apiClient("/auth/resend-otp", {method: "POST", body: {email}})
}

// forget password (sends reset code to email)
export function forgetPassword(email: string){
    return apiClient("/auth/forget-password", {method: "POST", body: {email}})
}

// reset password with code
export function resetPassword(payload: IResetPassword){
    return apiClient("/auth/reset-password", {method: "POST", body: payload})
}

// user signIn
export function userSignin(payload: ISignIn){
    return apiClient("/auth/signin", {method: "POST", body: payload})
}