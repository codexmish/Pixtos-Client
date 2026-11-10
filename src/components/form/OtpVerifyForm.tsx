"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOtpVerify, useResendOtp } from "@/hooks";
import type { IOtpVerify } from "@/types";
import { errorMessage } from "@/utils";
import { otpVerifySchema } from "@/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const OtpVerifyForm = () => {
  // -----getting email from params (signup sends ?email=...)
  const searchParams = useSearchParams();
  const otpEmail = searchParams.get("email");

  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: verify, isPending: verifyPending } = useOtpVerify();
  const { mutate: resend, isPending: resendPending } = useResendOtp();

  // -----resend countdown (code was just sent, so start at 60)
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // -----0:45 style
  const countdown = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

  // --------tanstack form
  const form = useForm({
    defaultValues: {
      email: otpEmail ?? "",
      otp: "",
    },
    validators: {
      onSubmit: otpVerifySchema,
    },
    onSubmit: (data) => {
      const verifyData: IOtpVerify = {
        email: data.value.email,
        otp: data.value.otp,
      };

      verify(verifyData, {
        onSuccess: () => {
          toast.add({
            title: "Email verified",
            description: "Welcome to Pixtos",
            type: "success",
          });
          router.push("/");
        },
        onError: (err) => {
          toast.add({
            title: "Verification failed",
            description: errorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  // -----resend code
  const handleResend = () => {
    if (!otpEmail) return;

    resend(otpEmail, {
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

  // -----opened without an email (e.g. typed the url), nothing to verify
  if (!otpEmail) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-slate-500">
          We couldn't find which email to verify. Please sign up again.
        </p>
        <Link
          href="/signup"
          className="font-semibold text-sm text-slate-900 hover:underline"
        >
          Go to Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* --------sent to */}
      <p className="text-center text-sm text-slate-500">
        Enter the 6-digit code we sent to{" "}
        <strong className="break-words font-semibold text-slate-900">
          {otpEmail}
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
        {/* -------------otp */}
        <form.Field name="otp">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            // -----same style for all 6 boxes
            const slotClass = `h-14 w-auto flex-1 rounded-xl border border-transparent bg-[#f3f4f8] text-xl font-semibold text-slate-900 first:rounded-xl first:border-l last:rounded-xl data-[active=true]:border-slate-300 data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-slate-900/5 ${isValid ? "border-red-500" : ""}`;

            return (
              <Field className="gap-2">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-800"
                >
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  id={field.name}
                  name={field.name}
                  onChange={(value) => field.handleChange(value)}
                  value={field.state.value}
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

                {/* ----error */}
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
          disabled={verifyPending}
          type="submit"
          className="mt-2 h-11.5 w-full gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {verifyPending ? (
            <>
              Verifying <Spinner />
            </>
          ) : (
            "Verify and continue"
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
        Wrong email?{" "}
        <Link
          href="/signup"
          className="font-semibold text-slate-900 hover:underline"
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
};

export default OtpVerifyForm;
