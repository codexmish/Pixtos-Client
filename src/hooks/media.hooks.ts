import {
    deleteMedia,
    emptyTrash,
    getMedia,
    getStorageStats,
    getTrash,
    restoreMedia,
    toggleFavorite,
    toggleTrash,
    uploadMedia,
} from "@/api";
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
            // -----album page shows the star too
            queryClient.invalidateQueries({queryKey: ["albums"]})
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

// -------get trash (key starts with "media", so every media change refreshes it)
export function useGetTrash(){
    return useQuery({
        queryKey: ["media", "trash"],
        queryFn: getTrash,
    })
}

// -------restore from trash
export function useRestoreMedia(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: restoreMedia,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}

// -------delete permanently
export function useDeleteMedia(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteMedia,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}

// -------empty trash
export function useEmptyTrash(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: emptyTrash,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["media"]})
        }
    })
}

// -------storage stats (key starts with "media", so upload / trash / delete refresh it)
export function useGetStorageStats(){
    return useQuery({
        queryKey: ["media", "stats"],
        queryFn: getStorageStats,
    })
}
