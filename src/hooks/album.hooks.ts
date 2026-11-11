import {
    addPhotosToAlbum,
    createAlbum,
    deleteAlbum,
    getAlbumById,
    getAlbums,
    removePhotoFromAlbum,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// -------get my albums
export function useGetAlbums(){
    return useQuery({
        queryKey: ["albums"],
        queryFn: getAlbums,
        // -----server sends 404 when there is no album, no need to try again
        retry: false,
    })
}

// -------get one album with its photos
export function useGetAlbum(id: string){
    return useQuery({
        queryKey: ["albums", id],
        queryFn: () => getAlbumById(id),
    })
}

// -------create album
export function useCreateAlbum(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createAlbum,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["albums"]})
            // -----sidebar stats has the album count
            queryClient.invalidateQueries({queryKey: ["media", "stats"]})
        }
    })
}

// -------add photos to album
export function useAddPhotosToAlbum(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addPhotosToAlbum,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["albums"]})
        }
    })
}

// -------remove one photo from album
export function useRemovePhotoFromAlbum(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: removePhotoFromAlbum,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["albums"]})
        }
    })
}

// -------delete album
export function useDeleteAlbum(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteAlbum,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["albums"]})
            // -----sidebar stats has the album count
            queryClient.invalidateQueries({queryKey: ["media", "stats"]})
        }
    })
}
