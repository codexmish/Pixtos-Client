"use client";

import {
  FolderHeartIcon,
  HardDriveIcon,
  ImageIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateAlbumModel from "../module/album/CreateAlbumModel";
import Uploadmodel from "../module/photos/Uploadmodel";

const DUMMY_STATS = {
  mediaCount: 11,
  imageCount: 10,
  videoCount: 1,
  favoriteCount: 0,
  totalBytes: 11535024,
  albumCount: 1,
};

const Sidebar = () => {
  // ----storage stats part
  const [stats, setStats] = useState(null as any);

  useEffect(() => {
    const fetchStats = async () => {
      setStats(DUMMY_STATS);
    };

    fetchStats();
    const interVal = setInterval(fetchStats, 15000);
    return () => clearInterval(interVal);
  }, []);

  const storageUsed = stats?.totalBytes
    ? (stats.totalBytes / (1024 * 1024)).toFixed(1)
    : "0.0";
  const storagePercentage = stats?.totalBytes
    ? Math.min(
        100,
        Math.max(3, Math.round((stats.totalBytes / (100 * 1024 * 1024)) * 100)),
      )
    : 2;

  // --------side menu part

  const sideMenuLinks = [
    { to: "/", label: "Photos & Videos", icon: ImageIcon },
    { to: "/favorites", label: "Favorites", icon: StarIcon },
    { to: "/albums", label: "Albums", icon: FolderHeartIcon },
    { to: "/trash", label: "Trash", icon: Trash2Icon },
  ];

  const router = useRouter();
  const pathName = usePathname();
  const [createAlbumState, setCreateAlbumState] = useState({
    isopen: false,
    photoIds: [],
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathName]);

  // -----handle upload success
  const handleUploadSuccess = () => {
    window.dispatchEvent(new CustomEvent("media-uploaded"));
  };
  // ------submit data to create new album
  const handleAlbumCreate = (album: any) => {
    setCreateAlbumState({ isopen: false, photoIds: [] });
    router.push(`/albums/${album._id}`);
  };

  // ------open created album
  const openCreateAlbum = (photoIds = []) => {
    setCreateAlbumState({ isopen: true, photoIds });
  };

  // -----handle upload button
  const handleUploadClick = () => {
    setIsMobileSidebarOpen(false);
    setIsUploadOpen(true);
  };

  // -----handle  create album button
  const handleCreateAlbumClick = () => {
    setIsMobileSidebarOpen(false);
    openCreateAlbum();
  };

  //     <Sidebar
  //   onCreateAlbumClick={() => openCreateAlbum()}
  //   onUploadClick={() => setIsUploadOpen(true)}
  //   isMobileOpen={isMobileSidebarOpen}
  //   onCloseMobile={() => setIsMobileSidebarOpen(false)}
  // />

  return (
    <>
      {/* -----mobile backdrop */}

      {isMobileSidebarOpen && (
        <div
          aria-hidden="true"
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar-container ${isMobileSidebarOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"}`}
      >
        {/* -----header */}
        <div className="sidebar-mobile-header">
          <div className="flex items-center gap-2.5">
            <Image src={"/logo.png"} alt="logo" width={30} height={30} />
            <span className="font-heading font-semibold text-slate-800 tracking-tight text-base">
              Pixtos
            </span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="sidebar-close-btn"
            type="button"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* -----Main Navigation */}

        <div className="space-y-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="sidebar-action-btn"
            >
              <PlusIcon className="size-4" />
              <span>Upload Photos</span>
            </button>

            <button
              type="button"
              onClick={handleCreateAlbumClick}
              className="sidebar-action-btn"
            >
              <FolderHeartIcon className="size-4" />
              <span>Create Album</span>
            </button>
          </div>

          <div className="space-y-1">
            {sideMenuLinks.map((item) => {
              const isactive = item.to === pathName;
              return (
                <Link
                  className={`sidebar-nav-item ${isactive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"}`}
                  href={item.to}
                  key={item.to}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* -----storage widget */}
        <div className="sidebar-storage-card">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-700">
              <HardDriveIcon className="size-4 text-red-400" />
              Used Storage
            </span>
            <span className="font-medium text-slate-900">{storageUsed} MB</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="sidebar-storage-bar"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>
              {stats?.mediaCount ?? stats?.imageCount ?? 0} media saved
            </span>
            {stats?.videoCount ? <span>{stats.videoCount} Videos</span> : null}
          </div>
        </div>
      </aside>

      <CreateAlbumModel
        isOpen={createAlbumState.isopen}
        onclose={() => setCreateAlbumState({ isopen: false, photoIds: [] })}
        onAlbumCreated={handleAlbumCreate}
        initialPhotoIds={createAlbumState.photoIds}
      />

      <Uploadmodel
        isOpen={isUploadOpen}
        onclose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default Sidebar;
