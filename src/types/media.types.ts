// -----one photo/video (same fields as mediaSchema in the server)
export interface IMedia {
  _id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  fileId: string;
  size: number;
  format: string;
  mediaType: "image" | "video";
  duration: number;
  width: number;
  height: number;
  owner: string;
  isFavorite: boolean;
  isTrash: boolean;
  trashedAt: string | null;
  objects: string[];
  createdAt: string;
  updatedAt: string;
}

// -----storage stats for the sidebar (GET /media/stats, names same as server)
export interface IStorageStats {
  mediaCount: number;
  imageCount: number;
  videoCount: number;
  fevortotalCount: number;
  albumCount: number;
  totalBytes: number;
}

// -----filters for GET /media (search text, photo/video tab, only favorites)
export interface IMediaQuery {
  q?: string;
  type?: "image" | "video";
  favorite?: boolean;
}
