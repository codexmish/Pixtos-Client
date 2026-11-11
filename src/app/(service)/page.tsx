"use client";

import BulkSelectionBar from "@/components/module/photos/BulkSelectionBar";
import PhotoGird, { type Media } from "@/components/module/photos/PhotoGird";
import { PhotoLightbox } from "@/components/module/photos/PhotoLightbox";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useGetMedia, useToggleFavorite, useToggleTrash } from "@/hooks";
import { useUI } from "@/providers/UIProvider";
import { errorMessage } from "@/utils";
import { Film, ImageIcon, Upload } from "lucide-react";
import { useState } from "react";

export const DUMMY_MEDIA = [
  {
    _id: "6acf809cfdb27097e8c82141",
    title: "image_1.jpg",
    url: "/images/image_1.jpg",
    thumbnailUrl: "/images/image_1.jpg",
    fileId: "6acf8099ead997d09ab80d6d",
    size: 453218,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1281,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "bird",
      "beak",
      "recreation",
      "leisure",
      "fun",
      "vacation",
      "feather",
    ],
    createdAt: "2026-10-14T13:16:12.357Z",
    updatedAt: "2026-10-14T13:16:12.357Z",
  },
  {
    _id: "6acf80bbfdb27097e8c8214a",
    title: "image_10.jpg",
    url: "/images/image_10.jpg",
    thumbnailUrl: "/images/image_10.jpg",
    fileId: "6acf80b7ead997d09ab8939d",
    size: 893139,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1440,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "mountainous landforms",
      "mountain",
      "adventure",
      "hill",
      "grassland",
      "highland",
      "hiking",
      "recreation",
      "wilderness",
      "outdoor recreation",
    ],
    createdAt: "2026-10-13T13:16:43.373Z",
    updatedAt: "2026-10-13T13:16:43.373Z",
  },
  {
    _id: "6acf80b7fdb27097e8c82149",
    title: "image_9.jpg",
    url: "/images/image_9.jpg",
    thumbnailUrl: "/images/image_9.jpg",
    fileId: "6acf80b5ead997d09ab889d5",
    size: 615222,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1565,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "bag",
      "recreation",
      "luggage & bags",
      "leisure",
      "backpack",
      "vacation",
      "child",
    ],
    createdAt: "2026-10-13T13:16:39.203Z",
    updatedAt: "2026-10-13T13:16:39.203Z",
  },
  {
    _id: "6acf80b4fdb27097e8c82148",
    title: "image_8.jpg",
    url: "/images/image_8.jpg",
    thumbnailUrl: "/images/image_8.jpg",
    fileId: "6acf80b1ead997d09ab87e71",
    size: 488196,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "boat",
      "body of water",
      "boats and boating--equipment and supplies",
      "watercraft",
      "recreation",
      "waterway",
      "outdoor recreation",
      "watercourse",
      "lake",
      "leisure",
    ],
    createdAt: "2026-10-13T13:16:36.412Z",
    updatedAt: "2026-10-13T13:16:36.412Z",
  },
  {
    _id: "6acf80b1fdb27097e8c82147",
    title: "image_7.jpg",
    url: "/images/image_7.jpg",
    thumbnailUrl: "/images/image_7.jpg",
    fileId: "6acf80adead997d09ab871a7",
    size: 615222,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1565,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "bag",
      "recreation",
      "luggage & bags",
      "leisure",
      "backpack",
      "vacation",
      "child",
    ],
    createdAt: "2026-10-12T13:16:33.134Z",
    updatedAt: "2026-10-12T13:16:33.134Z",
  },
  {
    _id: "6acf80adfdb27097e8c82146",
    title: "image_6.jpg",
    url: "/images/image_6.jpg",
    thumbnailUrl: "/images/image_6.jpg",
    fileId: "6acf80a9ead997d09ab86400",
    size: 1217701,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 2880,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "leisure",
      "recreation",
      "fun",
      "pedestrian",
      "child",
      "happiness",
      "vacation",
      "holiday",
    ],
    createdAt: "2026-10-12T13:16:29.320Z",
    updatedAt: "2026-10-12T13:16:29.320Z",
  },
  {
    _id: "6acf80a8fdb27097e8c82145",
    title: "image_5.jpg",
    url: "/images/image_5.jpg",
    thumbnailUrl: "/images/image_5.jpg",
    fileId: "6acf80a6ead997d09ab85165",
    size: 519250,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "sky",
      "daytime",
      "grass",
      "green",
      "summer",
      "cloud",
      "recreation",
      "grassland",
      "tower",
      "landmark",
    ],
    createdAt: "2026-10-11T13:16:24.839Z",
    updatedAt: "2026-10-11T13:16:24.839Z",
  },
  {
    _id: "6acf80a5fdb27097e8c82144",
    title: "image_4.jpg",
    url: "/images/image_4.jpg",
    thumbnailUrl: "/images/image_4.jpg",
    fileId: "6acf80a3ead997d09ab83314",
    size: 484358,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "boat",
      "watercraft",
      "coastal and oceanic landforms",
      "coast",
      "sea",
      "headland",
      "island",
      "promontory",
      "lake",
      "ocean",
    ],
    createdAt: "2026-10-11T13:16:21.690Z",
    updatedAt: "2026-10-11T13:16:21.690Z",
  },
  {
    _id: "6acf80a2fdb27097e8c82143",
    title: "image_3.jpg",
    url: "/images/image_3.jpg",
    thumbnailUrl: "/images/image_3.jpg",
    fileId: "6acf809fead997d09ab82563",
    size: 536439,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "transport",
      "bus",
      "commercial vehicle",
      "tour bus service",
      "public transport",
    ],
    createdAt: "2026-10-11T13:16:18.460Z",
    updatedAt: "2026-10-11T13:16:18.460Z",
  },
  {
    _id: "6acf809ffdb27097e8c82142",
    title: "image_2.jpg",
    url: "/images/image_2.jpg",
    thumbnailUrl: "/images/image_2.jpg",
    fileId: "6acf809dead997d09ab81a55",
    size: 712279,
    format: "image",
    mediaType: "image",
    duration: 0,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: [
      "boat",
      "leisure",
      "watercraft",
      "vacation",
      "lake",
      "travel",
      "sun hat",
      "hill station",
      "tourist attraction",
      "boats and boating--equipment and supplies",
    ],
    createdAt: "2026-10-11T13:16:15.213Z",
    updatedAt: "2026-10-11T13:16:15.213Z",
  },
  {
    _id: "6acf809ffdb27097e8c821422",
    title: "video_1.mp4",
    url: "/images/video_1.mp4",
    thumbnailUrl: "/images/video_1.png",
    fileId: "6acf809dead997d09ab81a555",
    size: 5122790,
    format: "mp4",
    mediaType: "video",
    duration: 10,
    width: 1920,
    height: 1280,
    owner: "6acf808efdb27097e8c82140",
    isFavorite: false,
    isTrash: false,
    trashedAt: null,
    objects: ["office", "table", "lamp", "desk", "book"],
    createdAt: "2026-10-11T13:16:15.213Z",
    updatedAt: "2026-10-11T13:16:15.213Z",
  },
];

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

  const handleBulkFavorite = async () => {
    console.log(selectedIds);
  };

  const handleBulkTrash = async () => {
    console.log(selectedIds);
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
