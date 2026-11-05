"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Media } from "@/components/module/photos/PhotoGird";
import { type AlbumDetail, DUMMY_ALBUM_DETAIL } from "../page";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Calendar, Plus, Trash2 } from "lucide-react";
import PhotoGird from "@/components/module/photos/PhotoGird";
import AddPhotosModel from "@/components/module/album/AddPhotosModel";
import { PhotoLightbox } from "@/components/module/photos/PhotoLightbox";

const AlbumDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<Media | null>(null);
  const [isAddPhotosModelOpen, setIsAddPhotosModelOpen] = useState(false);

  const fetchAlbum = async () => {
    setTimeout(() => {
      setAlbum(DUMMY_ALBUM_DETAIL);
      setLoading(false);
    }, 500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch when the album id changes
  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const handleRemoveFromAlbum = async (photoId: string) => {
    console.log(photoId);
  };

  const toggleFavorite = async (photoId: string) => {
    console.log(photoId);
  };

  const handleDeleteAlbum = async () => {
    if (!album) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this album? Photos inside will remain in your library.",
      )
    ) {
      return;
    }

    // -----delete album (demo for now), then go back to the albums list
    console.log(album._id);
    router.push("/albums");
  };

  if (loading) {
    return <Spinner />;
  }

  if (!album) {
    return null;
  }

  const existingPhotoIds = album.photos ? album.photos.map((p) => p._id) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* -----navigate back */}
      <button
        onClick={() => router.push("/albums")}
        type="button"
        className="flex items-center gap-2 hover:bg-slate-100 rounded-full p-2 px-4 text-slate-600 hover:text-slate-900 transition cursor-pointer"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back To Albums</span>
      </button>

      {/* -----album header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* ----left */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {album.title}
            </h1>
          </div>
          {album.description && (
            <p className="text-sm text-slate-600 max-w-xl">
              {album.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span>
              {album.photos.length || 0}
              {album.photos?.length === 1 ? " photo" : " photos"}
            </span>{" "}
            <span>.</span>{" "}
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Created {new Date(album.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* ----right */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddPhotosModelOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Photos</span>
          </button>

          <button
            onClick={handleDeleteAlbum}
            type="button"
            title="Delete Album"
            className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* ----photos od album */}
      {album.photos && album.photos.length > 0 ? (
        <PhotoGird
          photos={album.photos}
          selectId={selectedIds}
          onToggleSelect={(photoId) =>
            setSelectedIds((prev) =>
              prev.includes(photoId)
                ? prev.filter((i) => i !== photoId)
                : [...prev, photoId],
            )
          }
          onToggleFevorite={toggleFavorite}
          onSelecctPhoto={(photo) => setActivePhoto(photo)}
          onRemoveAlbum={handleRemoveFromAlbum}
        />
      ) : (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
          <h3>Album is empty</h3>
          <p>Add photos your existing library to populate this album</p>
          <button
            onClick={() => setIsAddPhotosModelOpen(true)}
            type="button"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Photos to ALbum</span>
          </button>
        </div>
      )}


      {/* ----ligtbox for preview */}
      <PhotoLightbox
      photos={album.photos || []}
      currentPhoto={activePhoto}
      onClose={()=>setActivePhoto(null)}
      onToggleFavorite={toggleFavorite}
      onTrashPhoto={(photoId)=>handleRemoveFromAlbum(photoId)}
      />

      {/* ----add photos model */}
      <AddPhotosModel
        isOpen={isAddPhotosModelOpen}
        albumId={album._id}
        existingPhotoIds={existingPhotoIds}
        onClose={()=>setIsAddPhotosModelOpen(false)}
        onPhotosAdded={(updatedAlbem)=>{
          setAlbum(updatedAlbem)
        }}
      />
    </div>
  );
};

export default AlbumDetailsPage;
