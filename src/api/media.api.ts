import apiClient from "@/lib/apiClient";

// upload photos / videos (files go as form-data, field name "media")
export function uploadMedia(files: File[]){
    const formData = new FormData()
    for (const file of files) {
        formData.append("media", file)
    }

    return apiClient("/media/upload", {method: "POST", body: formData})
}
