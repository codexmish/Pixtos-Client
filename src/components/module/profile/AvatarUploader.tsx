"use client";

import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUpdateAvatar } from "@/hooks";
import { errorMessage, initialsOf } from "@/utils";

// -----same limit as backend (5 mb)
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

interface AvatarUploaderProps {
  name: string;
  avatar: string;
}

const AvatarUploader = ({ name, avatar }: AvatarUploaderProps) => {
  // -----hidden file input, camera button opens it
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -----tanstack query data destracture
  const { mutate: uploadAvatar, isPending: avatarPending } = useUpdateAvatar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // ----clear input, so the same file can be picked again
    e.target.value = "";

    if (!file) return;

    // ----checking file before upload
    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Avatar not updated",
        description: "Only image files are allowed",
        type: "error",
      });
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.add({
        title: "Avatar not updated",
        description: "Image must be 5 MB or smaller",
        type: "error",
      });
      return;
    }

    uploadAvatar(file, {
      onSuccess: () => {
        toast.add({
          title: "Avatar updated",
          description: "Your new photo is saved",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Avatar not updated",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="relative">
      {/* ----avatar (photo or initials) */}
      <div className="size-24 rounded-full overflow-hidden bg-slate-900 text-white text-2xl font-semibold flex items-center justify-center">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={96}
            height={96}
            unoptimized
            className="size-full object-cover"
          />
        ) : (
          initialsOf(name)
        )}
      </div>

      {/* ----uploading overlay */}
      {avatarPending && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white">
          <Spinner />
        </div>
      )}

      {/* ----camera button, opens file picker */}
      <button
        type="button"
        disabled={avatarPending}
        aria-label="Change avatar"
        title="Change avatar"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 size-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
      >
        <CameraIcon className="size-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUploader;
