import apiClient from "@/lib/apiClient";
import type {
  IApiResponse,
  IBulkFavorite,
  IMedia,
  IMediaQuery,
  IStorageStats,
} from "@/types";

// upload photos / videos (files go as form-data, field name "media")
export function uploadMedia(files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("media", file);
  }

  return apiClient("/media/upload", { method: "POST", body: formData });
}

// get my media (not in trash), with search text and photo/video filter
export function getMedia(params: IMediaQuery) {
  return apiClient<IApiResponse<IMedia[]>>("/media", { query: params });
}

// favorite on/off
export function toggleFavorite(id: string) {
  return apiClient(`/media/fav-toggle/${id}`, { method: "PATCH" });
}

// move to trash
export function toggleTrash(id: string) {
  return apiClient(`/media/trash-toggle/${id}`, { method: "PATCH" });
}

// get my trash
export function getTrash() {
  return apiClient<IApiResponse<IMedia[]>>("/media/trash");
}

// restore from trash (same route as move to trash, with restore: true)
export function restoreMedia(id: string) {
  return apiClient(`/media/trash-toggle/${id}`, {
    method: "PATCH",
    body: { restore: true },
  });
}

// delete permanently (only items in trash)
export function deleteMedia(id: string) {
  return apiClient(`/media/delete/${id}`, { method: "PATCH" });
}

// empty trash (deletes every item in trash permanently)
export function emptyTrash() {
  return apiClient("/media/trash", { method: "DELETE" });
}

// storage stats for the sidebar
export function getStorageStats() {
  return apiClient<IApiResponse<IStorageStats>>("/media/stats");
}

// favorite many items at once (isFavorite is set on all of them, not toggled)
export function bulkFavorite(payload: IBulkFavorite) {
  return apiClient<IApiResponse<{ count: number }>>("/media/bulk-favorite", {
    method: "PATCH",
    body: payload,
  });
}

// move many items to trash at once
export function bulkTrash(ids: string[]) {
  return apiClient<IApiResponse<{ count: number }>>("/media/bulk-trash", {
    method: "PATCH",
    body: { ids },
  });
}
