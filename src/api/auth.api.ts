import apiClient from "@/lib/apiClient";
import { ISignIn, ISignup } from "@/types";

// user signup (server sends an otp to the email)
export function userSignup(payload: ISignup){
    return apiClient("/auth/signup", {method: "POST", body: payload})
}

// user signIn
export function userSignin(payload: ISignIn){
    return apiClient("/auth/signin", {method: "POST", body: payload})
}