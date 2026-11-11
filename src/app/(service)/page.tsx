"use client";

import BulkSelectionBar from "@/components/module/photos/BulkSelectionBar";
import PhotoGird, { type Media } from "@/components/module/photos/PhotoGird";
import { PhotoLightbox } from "@/components/module/photos/PhotoLightbox";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import {
  useBulkFavorite,
  useBulkTrash,
  useGetMedia,
  useToggleFavorite,
  useToggleTrash,
} from "@/hooks";
import { useUI } from "@/providers/UIProvider";
import { errorMessage } from "@/utils";
import { Film, ImageIcon, Upload } from "lucide-react";
import { useState } from "react";

const PhotosPage = () => {
  const { openCreateAlbum, openUpload, searchQuery } = useUI();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [activePhoto, setActivePhoto] = useState<Media | null>(null);

  // -----tab value -> backend type (all = no filter)
  const mediaType =
    filterType === "photos"
      ? "image"
      : filterType === "videos"
        ? "video"
        : undefined;

  // -----getting my media (refetches when search text or tab changes)
  const { data: mediaData, isLoading: loading } = useGetMedia({
    q: searchQuery.trim() || undefined,
    type: mediaType,
  });
  const photos = mediaData?.data ?? [];

  // -----tanstack query data destracture
  const { mutate: favToggle } = useToggleFavorite();
  const { mutate: trashToggle } = useToggleTrash();
  const { mutate: favBulk } = useBulkFavorite();
  const { mutate: trashBulk } = useBulkTrash();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // -----favorite on/off
  const toggleFevorite = (id: string) => {
    favToggle(id, {
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

  // -----add all selected to favorites (already favorite ones stay favorite)
  const handleBulkFavorite = () => {
    favBulk(
      { ids: selectedIds, isFavorite: true },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Added to favorites",
            description: `${res.data.count} item(s) added to favorites`,
            type: "success",
          });
          setSelectedIds([]);
        },
        onError: (err) => {
          toast.add({
            title: "Favorites not updated",
            description: errorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  // -----move all selected to trash
  const handleBulkTrash = () => {
    trashBulk(selectedIds, {
      onSuccess: (res) => {
        toast.add({
          title: "Moved to trash",
          description: `${res.data.count} item(s) moved, you can restore them from Trash`,
          type: "success",
        });
        setSelectedIds([]);
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
      {/* -----header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        {/* -----left */}
        <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            Photos & Videos{" "}
            {photos.length > 0 && (
              <span className="text-sm font-semibold text-slate-400 bg-slate-100 p-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}{" "}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All your preserved photos and videos, automatically organized by
            date
          </p>
        </div>

        {/* -----right */}
        <div className="flex items-center gap-2.5">
          {/* -----filter tabs (all / photos / videos), active style comes from the tab's data-active */}
          <Tabs
            defaultValue={"all"}
            value={filterType}
            onValueChange={(value) => setFilterType(value)}
          >
            <TabsList className="bg-slate-100 p-1 rounded-full">
              <TabsTrigger
                className="h-auto flex-none gap-1.5 border-0 px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer data-active:bg-white data-active:text-slate-900 data-active:font-bold group-data-[variant=default]/tabs-list:data-active:shadow-none"
                value={"all"}
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="h-auto flex-none gap-1.5 border-0 px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer data-active:bg-white data-active:text-slate-900 data-active:font-bold group-data-[variant=default]/tabs-list:data-active:shadow-none"
                value={"photos"}
              >
                <ImageIcon className="size-3" />
                Photos
              </TabsTrigger>
              <TabsTrigger
                className="h-auto flex-none gap-1.5 border-0 px-3 py-1 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer data-active:bg-white data-active:text-slate-900 data-active:font-bold group-data-[variant=default]/tabs-list:data-active:shadow-none"
                value={"videos"}
              >
                <Film className="size-3" />
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* -----media content */}
      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">
            {searchQuery ? "No matching media" : "Your media library is empty"}
          </h3>
          <p>
            {searchQuery
              ? `No media found for ${searchQuery}. Try a different kryword`
              : "Upload High quality photos and videos from your Device"}
          </p>
          <button
            onClick={openUpload}
            type="button"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
          >
            <Upload className="size-4" />
            <span>Upload now</span>
          </button>
        </div>
      ) : (
        <PhotoGird
          photos={photos}
          selectId={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleFevorite={toggleFevorite}
          onSelecctPhoto={(photo) => setActivePhoto(photo)}
        />
      )}

      <PhotoLightbox
        photos={photos}
        currentPhoto={activePhoto}
        onClose={() => setActivePhoto(null)}
        onToggleFavorite={toggleFevorite}
        onTrashPhoto={handleTrash}
        onAddToAlbum={(photo) => {
          // -----close lightbox first so its keyboard shortcuts don't fire while the album modal is open
          setActivePhoto(null);
          openCreateAlbum([photo._id]);
        }}
      />

      <BulkSelectionBar
        count={selectedIds.length}
        onclear={() => setSelectedIds([])}
        onFavorite={handleBulkFavorite}
        onAddToAlbum={() => openCreateAlbum?.(selectedIds)}
        onTrash={handleBulkTrash}
      />
    </div>
  );
};

export default PhotosPage;
