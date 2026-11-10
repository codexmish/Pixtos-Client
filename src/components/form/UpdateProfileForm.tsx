"use client";

import { useForm } from "@tanstack/react-form";
import { useUpdateProfile } from "@/hooks";
import { errorMessage } from "@/utils";
import { updateProfileSchema } from "@/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes (same look as signin inputs)
const labelClass = "text-sm font-medium text-slate-800";
const inputClass = (invalid: boolean) =>
  `h-11 rounded-xl border-transparent bg-[#f3f4f8] px-4 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-[#eef0f5] focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-slate-900/5 ${invalid ? "border-red-500" : ""}`;

interface UpdateProfileFormProps {
  name: string;
  email: string;
}

const UpdateProfileForm = ({ name, email }: UpdateProfileFormProps) => {
  // -----tanstack query data destracture
  const { mutate: update, isPending: updatePending } = useUpdateProfile();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      name,
    },
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: (data) => {
      update(
        { name: data.value.name.trim() },
        {
          onSuccess: () => {
            toast.add({
              title: "Profile updated",
              description: "Your new name is saved",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: "Profile not updated",
              description: errorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      className="flex flex-col gap-[18px]"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* -------------name field */}
      <form.Field name="name">
        {(field) => {
          const isValid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field className="gap-2">
              <FieldLabel htmlFor="profile-name" className={labelClass}>
                Name
              </FieldLabel>
              <Input
                id="profile-name"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Your name"
                autoComplete="name"
                className={inputClass(isValid)}
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

      {/* -------------email (can't be changed) */}
      <Field className="gap-2">
        <FieldLabel htmlFor="profile-email" className={labelClass}>
          Email
        </FieldLabel>
        <Input
          id="profile-email"
          value={email}
          disabled
          readOnly
          className="h-11 rounded-xl border-transparent bg-[#f3f4f8] px-4 text-sm text-slate-500"
        />
        <p className="text-xs text-slate-400">Email can&apos;t be changed</p>
      </Field>

      {/* -------------footer, save is off until the name changes */}
      <div className="flex justify-end pt-1">
        <form.Subscribe selector={(state) => state.values.name.trim() === name}>
          {(unchanged) => (
            <Button
              type="submit"
              disabled={updatePending || unchanged}
              className="h-11 gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              {updatePending ? (
                <>
                  Saving <Spinner />
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
