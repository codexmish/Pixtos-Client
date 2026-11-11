"use client";

import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useAddPhotosToAlbum, useGetMedia } from "@/hooks";
import { errorMessage } from "@/utils";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// -----props the add photos modal needs from the album page
type AddPhotosModelProps = {
  isOpen: boolean;
  albumId: string;
  existingPhotoIds: string[];
  onClose: () => void;
  onPhotosAdded: () => void;
};

const AddPhotosModel = ({
  isOpen,
  albumId,
  existingPhotoIds,
  onClose,
  onPhotosAdded,
}: AddPhotosModelProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // -----my library (same data as the main photo page, so it comes from cache)
  const { data: mediaData, isLoading: loading } = useGetMedia({});

  // -----only photos that aren't in this album yet
  const availablePhotos = (mediaData?.data ?? []).filter(
    (photo) => !existingPhotoIds.includes(photo._id),
  );

  // -----tanstack query data destracture
  const { mutate: addPhotos, isPending: submitting } = useAddPhotosToAlbum();

  // -----fresh selection every time the modal opens
  useEffect(() => {
    if (isOpen) setSelectedIds([]);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  // -----add selected photos to this album
  const handleAdd = () => {
    addPhotos(
      { albumId, photoIds: selectedIds },
      {
        onSuccess: () => {
          toast.add({
            title: "Photos added",
            description: `${selectedIds.length} item(s) added to this album`,
            type: "success",
          });
          onPhotosAdded();
        },
        onError: (err) => {
          toast.add({
            title: "Photos not added",
            description: errorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box-xl">
        {/* ---header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <h3 className="font-medium text-slate-800 text-base">
              Add photos to album
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <Spinner className="py-16" />
          ) : availablePhotos.length === 0 ? (
            <div>
              <div className="text-center py-16 text-slate-400 space-y-2">
                <p className="font-medium text-sm text-slate-600">
                  No additional photos available
                </p>
                <p className="text-xs">
                  all your photos are already in this album, or upload more
                  photos first.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availablePhotos.map((photo) => {
                const isSelected = selectedIds.includes(photo._id);
                const isVideo =
                  photo.mediaType === "video" ||
                  photo.format === "mp4" ||
                  photo.format === "mov" ||
                  photo.format === "webm";

                return (
                  <button
                    type="button"
                    key={photo._id}
                    onClick={() => toggleSelect(photo._id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${isSelected ? "border-red-600" : "border-transparent hover:border-slate-300"}`}
                  >
                    <Image
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.title}
                      width={400}
                      height={400}
                      className="size-full object-cover"
                    />

                    {isVideo && (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-medium pointer-events-none">
                        <PlayIcon className="size-2.5 fill-white" />
                        <span>Video</span>
                      </span>
                    )}

                    <span
                      className={`absolute top-2 right-2 size-6 rounded-full flex items-center justify-center transition-all ${isSelected ? "bg-red-600 text-white scale-100" : "bg-black/40 text-transparent group-hover:text-white group-hover:bg-black/60"}`}
                    >
                      <CheckIcon className="size-3.5 stroke-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ----footer */}
        <div className="modal-footer justify-between">
          <span>{selectedIds.length} Items Selected</span>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            disabled={submitting || selectedIds.length === 0}
            type="button"
            onClick={handleAdd}
            className="btn-primary"
          >
            {submitting ? <Spinner /> : `Add Selected ${selectedIds.length}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhotosModel;
