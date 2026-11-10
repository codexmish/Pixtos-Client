import apiClient from "@/lib/apiClient";
import {
    IApiResponse,
    IChangePassword,
    IOtpVerify,
    IResetPassword,
    ISignIn,
    ISignup,
    IUpdateProfile,
    IUser,
} from "@/types";

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

// get logged in user (uses the accessToken cookie)
export function getMe(){
    return apiClient<IApiResponse<IUser>>("/auth/me")
}

// user signIn
export function userSignin(payload: ISignIn){
    return apiClient("/auth/signin", {method: "POST", body: payload})
}

// user logout (server clears the token cookies)
export function userLogout(){
    return apiClient("/auth/logout", {method: "POST"})
}

// change password (logged in user)
export function changePassword(payload: IChangePassword){
    return apiClient("/auth/change-password", {method: "PATCH", body: payload})
}

// update profile (name)
export function updateProfile(payload: IUpdateProfile){
    return apiClient<IApiResponse<IUser>>("/auth/update-profile", {method: "PATCH", body: payload})
}

// update avatar (image goes as form-data, field name "avatar")
export function updateAvatar(file: File){
    const formData = new FormData()
    formData.append("avatar", file)

    return apiClient<IApiResponse<IUser>>("/auth/update-avatar", {method: "PATCH", body: formData})
}