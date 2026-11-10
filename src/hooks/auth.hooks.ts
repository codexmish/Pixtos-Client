import {
    forgetPassword,
    getMe,
    resendOtp,
    resetPassword,
    userSignin,
    userSignup,
    userVerify,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// -------user signup
export function useSignup(){
    return useMutation({
        mutationFn: userSignup,
    })
}

// -------otp verify
export function useOtpVerify(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userVerify,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["user"]})
        }
    })
}

// -------resend otp
export function useResendOtp(){
    return useMutation({
        mutationFn: resendOtp,
    })
}

// -------forget password
export function useForgetPassword(){
    return useMutation({
        mutationFn: forgetPassword,
    })
}

// -------reset password
export function useResetPassword(){
    return useMutation({
        mutationFn: resetPassword,
    })
}

// -------get me (signin / otp verify refresh this by invalidating ["user"])
export function useGetMe(){
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false,
    })
}


// -------user signin
export function useSignin(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userSignin,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["user"]})
        }
    }
    )
}