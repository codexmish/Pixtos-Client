"use client";
import { Input } from "@/components/ui/input";
import { Film, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type UploadModelProps = {
  isOpen: boolean;
  onclose: () => void;
  onUploadSuccess: () => void;
};

type Preview = {
  url: string;
  isvideo: boolean;
  name: string;
};

const Uploadmodel = ({
  isOpen,
  onclose,
  onUploadSuccess,
}: UploadModelProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    previews.forEach((p) => {
      URL.revokeObjectURL(p.url);
    });
    setSelectedFiles([]);
    setPreviews([]);
    onclose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );

    if (validFiles.length === 0) {
      // ------toaster
      return;
    }

    const newSelected = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelected);

    const newPreviws = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isvideo: file.type.startsWith("video/"),
      name: file.name,
    }));

    setPreviews((prev) => [...prev, ...newPreviws]);
  };

  const removeFiles = (index: number) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].url);
    }

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = ()=>{

  }

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-box-lg">
        {/* ------header */}
        <div className="modal-header">
          <div>
            <h2 className="text-lg font-medium text-slate-800">
              Upload To My Library
            </h2>
            <p className="text-xs text-slate-500">
              Upload and organize your photos and videos
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* -------content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* ----grag and drop box */}
          {/* biome-ignore lint/a11y/useSemanticElements: dropzone holds h3/p, which a <button> can't contain */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileUploadRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileUploadRef.current?.click();
              }
            }}
            className={`upload-dropzone ${isDragging ? "upload-dropzone-active" : "upload-dropzone-idle"}`}
          >
            <h3 className="font-medium text-slate-800 text-sm capitalize">
              Drag & Drop <span className="text-red-600">photos & videos</span>{" "}
              here or Browse
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports PNG, JPG, WEBP, GIF, MP4, MOV, WEBM (up to 100MB each)
            </p>
            <Input
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              ref={fileUploadRef}
              onChange={(e) => {
                handleFiles(e.target.files);
              }}
            />
          </div>

          {/* ----preview grid */}
          {previews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600 font-medium">
                  Selected {previews.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    previews.forEach((p) => {
                      URL.revokeObjectURL(p.url);
                    });
                    setSelectedFiles([]);
                    setPreviews([]);
                  }}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {previews.map((preview, index) => (
                  <div
                    key={`og${index + 1}`}
                    className="relative group  aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    {preview.isvideo ? (
                      <div className="size-full relative bg-slate-900 flex items-center justify-center">
                        <video
                          src={preview.url}
                          className="size-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs rounded text-[10px] text-white flex items-center gap-1">
                          <Film className="size-3 text-orange-400" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : (
                      <Image
                        width={100}
                        height={100}
                        src={preview.url}
                        alt="Previde-upload"
                        className="size-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFiles(index);
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ----footer */}
        <div className="modal-footer">
            <div className="flex items-center gap-2">
                <button onClick={handleClose} className="btn-secondary" type="button">
                    Cancel
                </button>

                <button onClick={handleUpload} className="btn-primary" type="button">
                    Submit
                </button>
            </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Uploadmodel;
