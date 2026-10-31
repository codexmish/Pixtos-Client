"use client";

import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { EyeClosed, EyeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

import { toast } from "../ui/toast";
import Link from "next/link";

const SignupForm = () => {
  // -----pass show state
  const [showPass, setShowPass] = useState(false);

  // -----router
  const router = useRouter();

  // ------tanstack form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: (data) => {
      const signupData = {
        name: data.value.name,
        email: data.value.email,
        password: data.value.password,
      };

      console.log(signupData);
    },
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <form
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* -------------name */}
        <form.Field name="name">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-800"
                >
                  Full name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  placeholder="Rahim Uddin"
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  autoComplete="off"
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

        {/* ----------password */}
        <form.Field name="password">
          {(field) => {
            const isValid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-slate-800"
                >
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    placeholder="8–32 characters"
                    className={`h-11 rounded-xl border-transparent bg-[#f3f4f8] pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 hover:bg-[#eef0f5] focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-slate-900/5 ${isValid ? "border-red-500" : ""}`}
                    type={showPass ? "text" : "password"}
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

        {/* ---------button */}
        <Button
          //   disabled={signupPending}
          type="submit"
          className="mt-2 h-11.5 w-full gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {/* {signupPending ? (
            <>
              Loading.. <Spinner />
            </>
          ) : (
            "Sign Up"
          )} */}
          Sign Up
        </Button>
      </form>

      {/* -------------footer */}
      <p className="text-center text-xs text-slate-500">
        Already registered?{" "}
        <Link
          href="/signin"
          className="font-semibold text-slate-900 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
