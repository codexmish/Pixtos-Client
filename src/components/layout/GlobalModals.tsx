"use client";

import { useRouter } from "next/navigation";
import { useUI } from "@/providers/UIProvider";
import CreateAlbumModel from "../module/album/CreateAlbumModel";
import Uploadmodel from "../module/photos/Uploadmodel";

// --------all app-wide modals live here, rendered once in the service layout
const GlobalModals = () => {
  const router = useRouter();

  // -----modal states from context
  const { isUploadOpen, closeUpload, createAlbum, closeCreateAlbum } = useUI();

  // -----handle upload success
  const handleUploadSuccess = () => {
    window.dispatchEvent(new CustomEvent("media-uploaded"));
  };

  return (
    <>
      {/* -----upload modal */}
      <Uploadmodel
        isOpen={isUploadOpen}
        onclose={closeUpload}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* -----create album modal, go to the new album after create */}
      <CreateAlbumModel
        isOpen={createAlbum.isOpen}
        onclose={closeCreateAlbum}
        initialPhotoIds={createAlbum.photoIds}
        onAlbumCreated={(album) => {
          closeCreateAlbum();
          router.push(`/albums/${album._id}`);
        }}
      />
    </>
  );
};

export default GlobalModals;
