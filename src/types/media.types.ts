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

// -----filters for GET /media (search text, photo/video tab, only favorites)
export interface IMediaQuery {
  q?: string;
  type?: "image" | "video";
  favorite?: boolean;
}
