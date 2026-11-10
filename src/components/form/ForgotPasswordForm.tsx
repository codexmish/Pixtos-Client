"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgetPassword } from "@/hooks";
import { errorMessage } from "@/utils";
import { forgetPasswordSchema } from "@/validations";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const ForgotPasswordForm = () => {
  // -----router
  const router = useRouter();

  // -----tanstack query data destracture
  const { mutate: sendCode, isPending: sendPending } = useForgetPassword();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgetPasswordSchema,
    },
    onSubmit: (data) => {
      const email = data.value.email.trim().toLowerCase();

      sendCode(email, {
        onSuccess: () => {
          toast.add({
            title: "Reset code sent",
            description: "Check your email",
            type: "success",
          });
          // -----go set the new password, email goes in the url
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
          toast.add({
            title: "Code not sent",
            description: errorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {/* --------form */}
      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* -------------email */}
        <form.Field name="email">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-800"
                >
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`h-11 rounded-xl border-transparent bg-[#f3f4f8] px-4 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-[#eef0f5] focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-slate-900/5 ${isValid ? "border-red-500" : ""}`}
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
          disabled={sendPending}
          type="submit"
          className="mt-2 h-11.5 w-full gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {sendPending ? (
            <>
              Sending code <Spinner />
            </>
          ) : (
            "Send reset code"
          )}
        </Button>
      </form>

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

export default ForgotPasswordForm;
