import { resendOtp, userSignin, userSignup, userVerify } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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