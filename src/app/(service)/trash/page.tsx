"use client";
import {
  Divide,
  MopIcon,
  PlayIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import {
  useDeleteMedia,
  useEmptyTrash,
  useGetTrash,
  useRestoreMedia,
} from "@/hooks";
import { errorMessage } from "@/utils";

const TrashPage = () => {
  // -----getting trash media
  const { data: trashData, isLoading: loading } = useGetTrash();
  const photos = trashData?.data ?? [];

  // -----tanstack query data destracture
  const { mutate: clearTrash } = useEmptyTrash();
  const { mutate: restore } = useRestoreMedia();
  const { mutate: deleteForever } = useDeleteMedia();

  // -----delete everything in trash permanently
  const handleEmptyTrash = () => {
    clearTrash(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Trash emptied",
          description: "All items are permanently deleted",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Trash not emptied",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  // -----restore back to library
  const handleRestore = (id: string) => {
    restore(id, {
      onSuccess: () => {
        toast.add({
          title: "Restored",
          description: "It's back in your library",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Not restored",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  // -----delete one item permanently
  const handleDeletePermanent = (id: string) => {
    deleteForever(id, {
      onSuccess: () => {
        toast.add({
          title: "Deleted permanently",
          description: "This item can't be restored now",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Not deleted",
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

                <div className="p-2 flex items-center justify-between bg-white border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-700 truncate pr-2">
                    {photo.title}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleRestore(photo._id)}
                      type="button"
                      className="p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition cursor-pointer"
                      title="Restor to Library"
                    >
                      <RotateCcwIcon className="size-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePermanent(photo._id)}
                      type="button"
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
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
