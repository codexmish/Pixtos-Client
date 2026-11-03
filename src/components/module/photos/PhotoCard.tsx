"use client";

import { CheckIcon, PlayIcon, StarIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Media } from "./PhotoGird";

// -----props one photo card needs from the grid
type PhotoCardProps = {
  photo: Media;
  isSelected: boolean;
  onToggleSelect: () => void;
  onToggleFevorite: () => void;
  onClick: () => void;
  onRemoveAlbum?: () => void;
};

const PhotoCard = ({
  photo,
  isSelected,
  onToggleSelect,
  onToggleFevorite,
  onClick,
  onRemoveAlbum,
}: PhotoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isVideo =
    photo.mediaType === "video" ||
    photo.format === "mp4" ||
    photo.format === "mov" ||
    photo.format === "webm";

  return (
    // biome-ignore lint/a11y/useSemanticElements: card holds other buttons, a <button> can't contain buttons
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        // -----only when the card itself is focused, not its inner buttons
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group photo-card-container photo-card-hover"
    >
      {/* ----aspect ration container */}
      <div className="aspect-4/3 w-full relative overflow-hidden bg-slate-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center text-xs text-slate-400">
            Loading.....
          </div>
        )}
        <Image
          src={photo.thumbnailUrl || photo.url}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          width={400}
          height={400}
          className={`photo-card-img ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* -----video badge */}
        {isVideo && (
          <div className="photo-card-video-badge">
            <PlayIcon className="size-2.5 fill-white" />
            <span>Video</span>
          </div>
        )}

        <div className="photo-card-overlay" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`photo-card-select-btn ${isSelected ? "photo-card-select-active" : "photo-card-select-inactive"}`}
        >
          <CheckIcon className={`size-3.5 ${isSelected ? "stroke-3" : ""}`} />
        </button>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onRemoveAlbum && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveAlbum();
              }}
              type="button"
              className="photo-card-action-btn hover:text-red-600"
              title="Remove from album"
            >
              <XIcon className="size-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFevorite();
            }}
            type="button"
            className={
              photo.isFavorite
                ? "photo-card-favorite-active"
                : "photo-card-favorite-inactive"
            }
            title={
              photo.isFavorite ? "Remove from Favorite" : "Add to Favorite"
            }
          >
            <StarIcon
              className={`size-3.5 ${photo.isFavorite ? "fill-amber-400 stroke-amber-500" : ""}`}
            />
          </button>
        </div>

        <div className="photo-card-title"> {photo.title}</div>
      </div>
    </div>
  );
};

export default PhotoCard;
