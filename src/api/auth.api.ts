import apiClient from "@/lib/apiClient";
import { IOtpVerify, ISignIn, ISignup } from "@/types";

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

// user signIn
export function userSignin(payload: ISignIn){
    return apiClient("/auth/signin", {method: "POST", body: payload})
}