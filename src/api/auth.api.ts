import apiClient from "@/lib/apiClient";
import { ISignIn } from "@/types";


// user signIn
export function userSignin(payload: ISignIn){
    return apiClient("/auth/signin", {method: "POST", body: payload})
}