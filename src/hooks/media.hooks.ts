import { getMedia, toggleFavorite, toggleTrash, uploadMedia } from "@/api";
import type { IMediaQuery } from "@/types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// -------upload media
export function useUploadMedia(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: uploadMedia,
        onSuccess: ()=>{
            // -----photo list gets the new files
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}

// -------get media (search text and filter are part of the key, so each one is cached)
export function useGetMedia(params: IMediaQuery){
    return useQuery({
        queryKey: ["media", params],
        queryFn: () => getMedia(params),
        // -----keep showing old photos while new search results load
        placeholderData: keepPreviousData,
    })
}

// -------favorite on/off
export function useToggleFavorite(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleFavorite,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}

// -------move to trash
export function useToggleTrash(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: toggleTrash,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}
