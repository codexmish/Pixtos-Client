"use client";
import type { Media } from "@/components/module/photos/PhotoGird";
import { useUI } from "@/providers/UIProvider";
import { FolderHeartIcon, ImageIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import { DUMMY_MEDIA } from "../page";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

// -----one album with its photos
export type AlbumDetail = {
  _id: string;
  title: string;
  description: string;
  photos: Media[];
  createdAt: string;
};

export const DUMMY_ALBUM_DETAIL = {
  _id: "6ad07889d514b3f0ab2c53c9",
  title: "Summer Vacation",
  description: "",
  owner: {
    _id: "6acf808efdb27097e8c82140",
    name: "GreatStack",
    email: "user.greatstack@gmail.com",
  },
  photos: DUMMY_MEDIA,
  createdAt: "2026-10-15T06:54:01.552Z",
  updatedAt: "2026-10-15T06:55:10.555Z",
};

const AlbumsPage = () => {
  const { openCreateAlbum } = useUI();
  const [albums, setAlbums] = useState<AlbumDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAlbum = async () => {
    setTimeout(() => {
      setAlbums([DUMMY_ALBUM_DETAIL]);
      setLoading(false);
    }, 500);
  };

  // -----delete album (demo for now), stop the click from also opening the album
  const handleDeleteAlbum = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    console.log(id);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load albums once on mount
  useEffect(() => {
    fetchAlbum();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight flex items-center gap-2">
            <FolderHeartIcon className="size-6 text-red-600" /> Albums{" "}
            {albums.length > 0 && (
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {albums.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Group your photo into butiful stories
          </p>
        </div>
        <button
          onClick={() => openCreateAlbum?.()}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-full transition cursor-pointer"
        >
          <PlusIcon className="size-4" />
          <span>New Album</span>
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {/* ------create new album card */}
          <button
            type="button"
            onClick={() => openCreateAlbum()}
            className="album-card-create group"
          >
            <span className="size-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <PlusIcon className="size-6" />
            </span>
            <span className="text-sm text-slate-700 group-hover:text-red-600">
              New Album
            </span>
          </button>

          {/* ----Album cards */}
          {albums.map((album) => {
            const firstPhoto = album.photos.length > 0 ? album.photos[0] : null;
            const coverUrl = firstPhoto
              ? firstPhoto.thumbnailUrl || firstPhoto.url
              : null;

            const photoCount = album.photos ? album.photos.length : 0;

            return (
              // biome-ignore lint/a11y/useSemanticElements: card holds a delete button, a <button> can't contain buttons
              <div
                role="button"
                tabIndex={0}
                key={album._id}
                className="group album-card"
                onClick={() => router.push(`/albums/${album._id}`)}
                onKeyDown={(e) => {
                  // -----only when the card itself is focused, not its delete button
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/albums/${album._id}`);
                  }
                }}
              >
                {/* -----album card design */}
                <div className="flex-1 min-h-0 w-full bg-slate-100 relative overflow-hidden">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={album.title}
                      width={400}
                      height={400}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center text-slate-300 bg-linear-to-br from-slate-100 to-slate-200/70">
                      <ImageIcon className="size-10 mb-1" />
                      <span className="text-[11px] font-medium text-slate-400 ">
                        No Photos Yet
                      </span>
                    </div>
                  )}
                </div>

                {/* -----content footer */}
                <div className="px-4 pb-3 py-2 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h4 className="text-slate-800 text-sm truncate group-hover:text-red-600 transition font-medium">
                      {album.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {photoCount} {photoCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {/* ----action button on card hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={(e)=>handleDeleteAlbum(e, album._id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      title="Delete album"
                      type="button"
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

export default AlbumsPage;
