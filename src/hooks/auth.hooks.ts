import { userSignin } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";



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