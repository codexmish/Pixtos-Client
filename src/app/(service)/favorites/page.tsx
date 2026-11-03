"use client";
import type { Media } from "@/components/module/photos/PhotoGird";
import { useUI } from "@/providers/UIProvider";
import { useEffect, useState } from "react";
import { DUMMY_MEDIA } from "../page";
import { Spinner } from "@/components/ui/spinner";
import PhotoGird from "@/components/module/photos/PhotoGird";
import { PhotoLightbox } from "@/components/module/photos/PhotoLightbox";

const FavoritesPage = () => {
  const { searchQuery } = useUI();
  const [photos, setPhotos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<Media | null>(null);

  const fetchFavorite = async () => {
    setTimeout(() => {
      setPhotos(DUMMY_MEDIA.slice(5, 9));
      setLoading(false);
    }, 500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch when search changes
  useEffect(() => {
    fetchFavorite();
  }, [searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleFavorite = async (id: string) => {
    console.log(id);
  };

  const handleTrash = async (id: string) => {
    console.log(id);
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
