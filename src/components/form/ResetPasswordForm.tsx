"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForgetPassword, useResetPassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { resetPasswordSchema } from "@/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

// -----design classes (same look as signin inputs)
const labelClass = "text-sm font-medium text-slate-800";
const inputClass = (invalid: boolean) =>
  `h-11 rounded-xl border-transparent bg-[#f3f4f8] pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-[#eef0f5] focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-slate-900/5 ${invalid ? "border-red-500" : ""}`;

const ResetPasswordForm = () => {
  // -----email from url (forgot password sends ?email=...)
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  // -----router
  const router = useRouter();

  // -----pass show state (both password fields)
  const [showPass, setShowPass] = useState(false);

  // -----tanstack query data destracture
  const { mutate: reset, isPending: resetPending } = useResetPassword();
  const { mutate: resend, isPending: resendPending } = useForgetPassword();

  // -----resend countdown (code was just sent, so start at 60)
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // -----0:45 style
  const countdown = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: (data) => {
      reset(
        { email, otp: data.value.otp, newPassword: data.value.newPassword },
        {
          onSuccess: () => {
            toast.add({
              title: "Password reset",
              description: "Sign in with your new password",
              type: "success",
            });
            router.push("/signin");
          },
          onError: (err) => {
            toast.add({
              title: "Password not reset",
              description: errorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  // -----send a new code (same api as forgot password)
  const handleResend = () => {
    resend(email, {
      onSuccess: () => {
        toast.add({
          title: "New code sent",
          description: "Check your email",
          type: "success",
        });
        setSecondsLeft(60);
        // ----old code doesn't work anymore
        form.setFieldValue("otp", "");
      },
      onError: (err) => {
        toast.add({
          title: "Code not sent",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  // -----no email in url, start from forgot password
  if (!email) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-slate-500">
          We need your email to send a reset code.
        </p>
        <Link
          href="/forgot-password"
          className="font-semibold text-sm text-slate-900 hover:underline"
        >
          Go to Forgot password
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* --------sent to */}
      <p className="text-center text-sm text-slate-500">
        We sent a code to{" "}
        <strong className="break-words font-semibold text-slate-900">
          {email}
        </strong>
        . It expires in 5 minutes.
      </p>

      {/* --------form */}
      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* -------------code */}
        <form.Field name="otp">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            // -----same style for all 6 boxes
            const slotClass = `h-14 w-auto flex-1 rounded-xl border border-transparent bg-[#f3f4f8] text-xl font-semibold text-slate-900 first:rounded-xl first:border-l last:rounded-xl data-[active=true]:border-slate-300 data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-slate-900/5 ${isValid ? "border-red-500" : ""}`;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className={labelClass}>
                  Reset code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  autoComplete="one-time-code"
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="w-full gap-2">
                    <InputOTPSlot index={0} className={slotClass} />
                    <InputOTPSlot index={1} className={slotClass} />
                    <InputOTPSlot index={2} className={slotClass} />
                    <InputOTPSlot index={3} className={slotClass} />
                    <InputOTPSlot index={4} className={slotClass} />
                    <InputOTPSlot index={5} className={slotClass} />
                  </InputOTPGroup>
                </InputOTP>
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

        {/* -------------new password */}
        <form.Field name="newPassword">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className={labelClass}>
                  New password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPass ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                    placeholder="8–32 characters"
                    className={inputClass(isValid)}
                  />
                  <button
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700"
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
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

        {/* -------------confirm password */}
        <form.Field name="confirmPassword">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name} className={labelClass}>
                  Confirm new password
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPass ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="new-password"
                  placeholder="Type it again"
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

        {/* ---------button */}
        <Button
          disabled={resetPending}
          type="submit"
          className="mt-2 h-11.5 w-full gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {resetPending ? (
            <>
              Resetting <Spinner />
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      {/* -------------resend */}
      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f4f8] px-4 py-3 text-sm text-slate-500">
        <span>Didn't get the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0 || resendPending}
          className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-900 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          {resendPending ? (
            <>
              Sending <Spinner />
            </>
          ) : secondsLeft > 0 ? (
            `Resend in ${countdown}`
          ) : (
            "Resend code"
          )}
        </button>
      </div>

      {/* -------------footer */}
      <p className="text-center text-xs text-slate-500">
        Remembered it?{" "}
        <Link
          href="/signin"
          className="font-semibold text-slate-900 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
