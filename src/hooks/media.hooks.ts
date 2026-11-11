import { uploadMedia } from "@/api";
import { useMutation } from "@tanstack/react-query";

// -------upload media
export function useUploadMedia(){
    return useMutation({
        mutationFn: uploadMedia,
    })
}
