import { userSignin, userSignup } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// -------user signup
export function useSignup(){
    return useMutation({
        mutationFn: userSignup,
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