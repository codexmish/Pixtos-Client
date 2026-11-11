import type { IMedia } from "./media.types";

// -----one album with its photos (GET /album/:id sends full photo data)
export interface IAlbum {
  _id: string;
  title: string;
  description: string;
  photos: IMedia[];
  createdAt: string;
  updatedAt: string;
}

// -----album in the albums list (server sends only a few fields of each photo)
export interface IAlbumSummary extends Omit<IAlbum, "photos"> {
  photos: Pick<
    IMedia,
    "_id" | "title" | "url" | "thumbnailUrl" | "mediaType"
  >[];
}

// -----create album body (photoIds are added right away)
export interface ICreateAlbum {
  title: string;
  description?: string;
  photoIds?: string[];
}

// -----add photos to an album
export interface IAddPhotosToAlbum {
  albumId: string;
  photoIds: string[];
}

// -----remove one photo from an album
export interface IRemovePhotoFromAlbum {
  albumId: string;
  photoId: string;
}
