"use client";
import CreateAlbumForm from "@/components/form/CreateAlbumForm";
import { FolderPlusIcon, XIcon } from "lucide-react";
import React, { useState } from "react";

export type Album = {
  _id: string;
  title: string;
  description?: string;
};

type CreateAlbumModelProps = {
  isOpen: boolean;
  onclose: () => void;
  onAlbumCreated: (album: Album) => void;
  initialPhotoIds?: string[];
};

const CreateAlbumModel = ({
  isOpen,
  onclose,
  onAlbumCreated,
  initialPhotoIds = [],
}: CreateAlbumModelProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onclose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box-md shadow-2xl">
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <FolderPlusIcon className="size-5 text-red-600" />
            <h3 className="text-base font-semibold text-slate-800">New Album</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <CreateAlbumForm
          initialPhotoIds={initialPhotoIds}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
};

export default CreateAlbumModel;
