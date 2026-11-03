"use client";
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import PhotoCard from "./PhotoCard";

// -----one photo/video item
export type Media = {
  _id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  mediaType: string;
  format: string;
  size: number;
  width: number;
  height: number;
  objects: string[];
  isFavorite: boolean;
  createdAt: string;
};

// -----props the grid needs from the page
type PhotoGirdProps = {
  photos: Media[];
  selectId: string[];
  onToggleSelect: (id: string) => void;
  onToggleFevorite: (id: string) => void;
  onSelecctPhoto: (photo: Media) => void;
  onRemoveAlbum?: (id: string) => void;
};

const PhotoGird = ({
  photos,
  selectId,
  onToggleSelect,
  onToggleFevorite,
  onSelecctPhoto,
  onRemoveAlbum,
}: PhotoGirdProps) => {
  const grouped = useMemo(() => {
    // -----date label -> photos of that date
    const groups: Record<string, Media[]> = {};
    const today = new Date().toDateString();
    const yesterDay = new Date(Date.now() - 86400000).toDateString();

    photos.forEach((photo) => {
      const dateObj = new Date(photo.createdAt);
      const dateStr = dateObj.toDateString();
      let label = dateObj.toLocaleDateString("en-us", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (dateStr === today) {
        label = "Today";
      } else if (dateStr === yesterDay) {
        label = "Yesterday";
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(photo);
    });

    return groups;
  }, [photos]);

  const selectGroup = (groupPhotos: Media[]) => {
    const allSelected = groupPhotos.every((p) => selectId.includes(p._id));

    groupPhotos.forEach((p) => {
      if (allSelected && selectId.includes(p._id)) {
        onToggleSelect(p._id);
      } else if (!allSelected && !selectId.includes(p._id)) {
        onToggleSelect(p._id);
      }
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {Object.entries(grouped).map(([dateLabel, groupPhotos]) => {
        const isGroupAllSelected =
          groupPhotos.length > 0 &&
          groupPhotos.every((p) => selectId.includes(p._id));
        return (
          <div className="space-y-3" key={dateLabel}>
            {/* -----date header */}
            <div className="flex items-center gap-2 backdrop-blur-xs py-2 z-20">
              <button
                onClick={() => selectGroup(groupPhotos)}
                type="button"
                className={`group/btn flex items-center gap-2 text-sm font-medium tracking-tight transition cursor-pointer ${isGroupAllSelected ? "text-red-600" : "text-slate-800 hover:text-red-600"}`}
                title="Select all in this day"
              >
                <span className="size-5 rounded-full border border-slate-300 group-hover/btn:border-red-500 flex items-center justify-center text-xs">
                  <CheckCircle2Icon
                    className={`size-4 transition ${isGroupAllSelected ? "text-red-600 fill-red-100" : "text-transparent group-hover/btn:text-slate-300"}`}
                  />
                </span>

                <span>{dateLabel}</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">
                ({groupPhotos.length})
              </span>
            </div>

            {/* -----media grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {groupPhotos.map((photo) => (
                <PhotoCard
                  key={photo._id}
                  photo={photo}
                  isSelected={selectId.includes(photo._id)}
                  onToggleSelect={()=>onToggleSelect(photo._id)}
                  onToggleFevorite={()=>onToggleFevorite(photo._id)}
                  onClick={()=>onSelecctPhoto(photo)}
                  onRemoveAlbum={onRemoveAlbum ? ()=> onRemoveAlbum(photo._id) : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGird;
