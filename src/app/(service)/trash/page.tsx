"use client";
import type { Media } from "@/components/module/photos/PhotoGird";
import { useEffect, useState } from "react";
import { DUMMY_MEDIA } from "../page";
import { Divide, MopIcon, PlayIcon, Trash2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const TrashPage = () => {
  const [photos, setPhotos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setTimeout(() => {
      setPhotos(DUMMY_MEDIA);
      setLoading(false);
    }, 1000);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load trash once on mount
  useEffect(() => {
    fetchTrash();
  }, []);

  const handleEmptyTrash = async () => {
    console.log("handle empty trash");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            <Trash2Icon className="size-6 text-red-500" />
            Trash{" "}
            {photos.length > 0 && (
              <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Items in trash can be restored or permanently removed
          </p>
        </div>

        {photos.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            type="button"
            className="flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-full transition cursor-pointer"
          >
            <MopIcon className="size-4 mr-2" />
            <span>Clear Trash</span>
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">Trash is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Deleted photos and videos will be safely stored here before
            permanent removal
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {photos.map((photo) => {
            const isVideo =
              photo.mediaType === "video" ||
              photo.format === "mp4" ||
              photo.format === "mov" ||
              photo.format === "webm";

            return (
              <div
                key={photo._id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <Image
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    width={400}
                    height={400}
                    className="size-full object-cover"
                  />
                  {isVideo && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white rounded text-[10px] font-medium pointer-events-none">
                      <PlayIcon className="size-2.5 fill-white" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
