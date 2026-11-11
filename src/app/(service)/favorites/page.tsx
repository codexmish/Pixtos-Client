"use client";
import type { Media } from "@/components/module/photos/PhotoGird";
import { useUI } from "@/providers/UIProvider";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import PhotoGird from "@/components/module/photos/PhotoGird";
import { PhotoLightbox } from "@/components/module/photos/PhotoLightbox";
import { toast } from "@/components/ui/toast";
import { useGetMedia, useToggleFavorite, useToggleTrash } from "@/hooks";
import { errorMessage } from "@/utils";

const FavoritesPage = () => {
  const { searchQuery } = useUI();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<Media | null>(null);

  // -----getting only favorite media (refetches when search text changes)
  const { data: mediaData, isLoading: loading } = useGetMedia({
    favorite: true,
    q: searchQuery.trim() || undefined,
  });
  const photos = mediaData?.data ?? [];

  // -----tanstack query data destracture
  const { mutate: favToggle } = useToggleFavorite();
  const { mutate: trashToggle } = useToggleTrash();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // -----remove from favorites
  const toggleFavorite = (id: string) => {
    favToggle(id, {
      onSuccess: () => {
        // ----photo leaves this list, so close the lightbox too
        setActivePhoto(null);
      },
      onError: (err) => {
        toast.add({
          title: "Favorite not updated",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  // -----move to trash
  const handleTrash = (id: string) => {
    trashToggle(id, {
      onSuccess: () => {
        // ----trashed photo leaves the list, so close the lightbox too
        setActivePhoto(null);
        toast.add({
          title: "Moved to trash",
          description: "You can restore it from Trash",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Not moved to trash",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Favorites{" "}
            {photos.length > 0 && (
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your photos and videos for quick access
          </p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">
            No Favorites yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Click the star icon on any photo or video in your collection to add
            it your favorites.
          </p>
        </div>
      ) : (
        <PhotoGird
          photos={photos}
          selectId={selectedIds}
          onToggleSelect={toggleSelect}
          onSelecctPhoto={(photo) => setActivePhoto(photo)}
          onToggleFevorite={toggleFavorite}
        />
      )}

      <PhotoLightbox
        photos={photos}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={toggleFavorite}
        onTrashPhoto={handleTrash}
      />
    </div>
  );
};

export default FavoritesPage;
