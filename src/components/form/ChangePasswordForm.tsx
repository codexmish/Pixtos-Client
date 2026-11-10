"use client";

import { useForm } from "@tanstack/react-form";
import { EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useChangePassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { changePasswordSchema } from "@/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes (same look as signin inputs)
const labelClass = "text-sm font-medium text-slate-800";
const inputClass = (invalid: boolean) =>
  `h-11 rounded-xl border-transparent bg-[#f3f4f8] pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-[#eef0f5] focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-slate-900/5 ${invalid ? "border-red-500" : ""}`;

// -----the three password fields
const passwordFields = [
  {
    name: "oldPassword",
    label: "Current password",
    autoComplete: "current-password",
    placeholder: "Your current password",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    placeholder: "8–32 characters",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
    placeholder: "Type it again",
  },
] as const;

const ChangePasswordForm = () => {
  // -----pass show state (all three fields)
  const [showPass, setShowPass] = useState(false);

  // -----tanstack query data destracture
  const { mutate: change, isPending: changePending } = useChangePassword();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: (data) => {
      change(
        {
          oldPassword: data.value.oldPassword,
          newPassword: data.value.newPassword,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Password updated",
              description: "Use your new password next time you sign in",
              type: "success",
            });
            form.reset();
          },
          onError: (err) => {
            toast.add({
              title: "Password not updated",
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
      {passwordFields.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={`cp-${item.name}`} className={labelClass}>
                  {item.label}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={`cp-${item.name}`}
                    name={field.name}
                    type={showPass ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder={item.placeholder}
                    autoComplete={item.autoComplete}
                    className={inputClass(isValid)}
                  />
                  {/* ----one eye button (on the first field) shows all three */}
                  {item.name === "oldPassword" && (
                    <button
                      className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700"
                      type="button"
                      aria-label={
                        showPass ? "Hide passwords" : "Show passwords"
                      }
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  )}
                </div>
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
      ))}

      {/* -------------footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-slate-900 hover:underline"
        >
          Forgot your current password?
        </Link>
        <Button
          type="submit"
          disabled={changePending}
          className="h-11 gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {changePending ? (
            <>
              Updating <Spinner />
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
