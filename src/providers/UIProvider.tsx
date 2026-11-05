"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

// -----create album modal state, photoIds are pre-selected photos for the new album
type CreateAlbumState = {
  isOpen: boolean;
  photoIds: string[];
};

// -----everything the context shares with other components
type UIContextValue = {
  // -----mobile sidebar
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // -----upload modal
  isUploadOpen: boolean;
  openUpload: () => void;
  closeUpload: () => void;

  // -----create album modal
  createAlbum: CreateAlbumState;
  openCreateAlbum: (photoIds?: string[]) => void;
  closeCreateAlbum: () => void;

  // -----navbar search
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

// --------create the context (the shared notice board)
const UIContext = createContext<UIContextValue | null>(null);

// --------provider, wrap components that need the shared ui state
export const UIProvider = ({ children }: { children: ReactNode }) => {
  // -----shared states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [createAlbum, setCreateAlbum] = useState<CreateAlbumState>({
    isOpen: false,
    photoIds: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  // -----states and actions passed down through the context
  const value: UIContextValue = {
    // -----open/close mobile sidebar
    isMobileSidebarOpen,
    toggleSidebar: () => setIsMobileSidebarOpen((prev) => !prev),
    closeSidebar: () => setIsMobileSidebarOpen(false),

    // -----open upload modal and close mobile sidebar
    isUploadOpen,
    openUpload: () => {
      setIsMobileSidebarOpen(false);
      setIsUploadOpen(true);
    },
    closeUpload: () => setIsUploadOpen(false),

    // -----open create album modal, optionally with pre-selected photos
    createAlbum,
    openCreateAlbum: (photoIds = []) => {
      setIsMobileSidebarOpen(false);
      setCreateAlbum({ isOpen: true, photoIds });
    },
    closeCreateAlbum: () => setCreateAlbum({ isOpen: false, photoIds: [] }),

    // -----navbar search text
    searchQuery,
    setSearchQuery,
  };

  return <UIContext value={value}>{children}</UIContext>;
};

// --------custom hook to read the shared ui state, only works inside <UIProvider>
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside <UIProvider>");
  return context;
};
