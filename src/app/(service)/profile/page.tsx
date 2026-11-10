"use client";

import {
  BadgeCheckIcon,
  CalendarIcon,
  MailIcon,
  ShieldIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import { Spinner } from "@/components/ui/spinner";
import { useGetMe } from "@/hooks";
import { initialsOf } from "@/utils";

const ProfilePage = () => {
  // -----getting logged in user data (/auth/me)
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // -----account details rows
  const details = user
    ? [
        { icon: MailIcon, label: "Email", value: user.email },
        {
          icon: ShieldIcon,
          label: "Role",
          value: user.role === "admin" ? "Admin" : "User",
        },
        {
          icon: CalendarIcon,
          label: "Joined",
          value: new Date(user.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* -----page header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight">
            Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your account details and password
          </p>
        </div>
      </div>

      {userDataLoading ? (
        <Spinner />
      ) : !user ? (
        // -----not logged in (or session expired)
        <div className="empty-state-card">
          <h3 className="text-lg font-medium text-slate-800">
            You are not signed in
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Sign in to see your profile and change your password.
          </p>
          <Link
            href="/signin"
            className="inline-flex mt-4 h-10 items-center rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
          {/* -----profile card */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80">
            <div className="flex flex-col items-center text-center">
              {/* ----avatar (photo or initials) */}
              <div className="size-24 rounded-full overflow-hidden bg-slate-900 text-white text-2xl font-semibold flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  initialsOf(user.name)
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {user.name}
              </h3>

              {/* ----verified badge */}
              {user.isVerified ? (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  <BadgeCheckIcon className="size-3.5" />
                  Verified
                </span>
              ) : (
                <span className="mt-2 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Not verified
                </span>
              )}
            </div>

            {/* ----account details */}
            <dl className="mt-6 space-y-3 border-t border-slate-100 pt-6">
              {details.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="size-9 shrink-0 rounded-xl bg-[#f3f4f8] flex items-center justify-center text-slate-500">
                    <item.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-500">{item.label}</dt>
                    <dd className="text-sm font-medium text-slate-800 truncate">
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* -----change password card */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">
              Change password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-6">
              Enter your current password, then choose a new one
            </p>
            <ChangePasswordForm />
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
