import { useForm } from "@tanstack/react-form";
import React from "react";
import { useCreateAlbum } from "@/hooks";
import { errorMessage } from "@/utils";
import { createAlbumSchema } from "@/validations";
import type { Album } from "../module/album/CreateAlbumModel";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const CreateAlbumForm = ({
  initialPhotoIds,
  handleClose,
  onAlbumCreated,
}: {
  initialPhotoIds: string[];
  handleClose: any;
  onAlbumCreated: (album: Album) => void;
}) => {
  // -----tanstack query data destracture
  const { mutate: create, isPending: createPending } = useCreateAlbum();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: createAlbumSchema,
    },
    onSubmit: (data) => {
      const albumData = {
        title: data.value.title.trim(),
        description: data.value.description.trim(),
        // ----selected photos go in right away
        photoIds: initialPhotoIds,
      };

      create(albumData, {
        onSuccess: (res) => {
          toast.add({
            title: "Album created",
            description: `"${res.data.title}" is ready`,
            type: "success",
          });
          onAlbumCreated(res.data);
        },
        onError: (err) => {
          toast.add({
            title: "Album not created",
            description: errorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  return (
    <>
      {/* --------form */}
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4 p-5">
          {/* -------------title */}
          <form.Field name="title">
            {(field) => {
              const isValid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field className="gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700"
                  >
                    Title
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    placeholder="My Album"
                    className={`h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-red-500 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-red-500/10 ${isValid ? "border-red-500" : ""}`}
                  />
                  {isValid && (
                    <FieldError
                      className="text-xs text-red-500"
                      errors={field.state.meta.errors}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* -------------description */}
          <form.Field name="description">
            {(field) => {
              const isValid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field className="gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    placeholder="My Description"
                    className={`h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-red-500 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-red-500/10 ${isValid ? "border-red-500" : ""}`}
                  />
                  {isValid && (
                    <FieldError
                      className="text-xs text-red-500"
                      errors={field.state.meta.errors}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {initialPhotoIds.length > 0 && (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
              {initialPhotoIds.length} photos will be added autometically
            </p>
          )}
        </div>

        <div className="modal-footer gap-2">
          <button type="button" onClick={handleClose} className="btn-secondary">
            Cancel
          </button>

          {/* ----modal closes after the album is created (onAlbumCreated) */}
          <button
            type="submit"
            disabled={createPending}
            className="btn-primary"
          >
            {createPending ? (
              <>
                Creating <Spinner />
              </>
            ) : (
              "Create Album"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateAlbumForm;
