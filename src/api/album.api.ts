import apiClient from "@/lib/apiClient";
import type {
  IAddPhotosToAlbum,
  IAlbum,
  IAlbumSummary,
  IApiResponse,
  ICreateAlbum,
  IRemovePhotoFromAlbum,
} from "@/types";

// create album
export function createAlbum(payload: ICreateAlbum) {
  return apiClient<IApiResponse<IAlbumSummary>>("/album/create", {
    method: "POST",
    body: payload,
  });
}

// get my albums
export function getAlbums() {
  return apiClient<IApiResponse<IAlbumSummary[]>>("/album");
}

// get one album with its photos
export function getAlbumById(id: string) {
  return apiClient<IApiResponse<IAlbum>>(`/album/${id}`);
}

// add photos to album (photos already in it are skipped by the server)
export function addPhotosToAlbum({ albumId, photoIds }: IAddPhotosToAlbum) {
  return apiClient(`/album/${albumId}`, {
    method: "PATCH",
    body: { photoIds },
  });
}

// remove one photo from album (photo stays in library)
export function removePhotoFromAlbum({
  albumId,
  photoId,
}: IRemovePhotoFromAlbum) {
  return apiClient(`/album/${albumId}/${photoId}`, { method: "PATCH" });
}

// delete album (photos stay in library)
export function deleteAlbum(id: string) {
  return apiClient(`/album/${id}`, { method: "DELETE" });
}
