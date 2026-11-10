"use client";

import {
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGetMe, useLogout } from "@/hooks";
import { useUI } from "@/providers/UIProvider";
import { errorMessage, initialsOf } from "@/utils";
import { toast } from "../ui/toast";

const Navbar = () => {
  // -----shared actions from context
  const { toggleSidebar, openUpload, searchQuery, setSearchQuery } = useUI();

  // -----getting logged in user data (/auth/me)
  const { data: userData, isLoading: userDataLoading } = useGetMe();
  const user = userData?.data;

  // --------avatar initials, e.g. "John Dow" -> "JD"
  const initials = user ? initialsOf(user.name) : "";

  // -----local states, only navbar uses these
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // -----close dropdown on outside click or Esc
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  // -----logout
  const router = useRouter();
  const { mutate: logOut } = useLogout();

  const handleLogout = () => {
    setDropdownOpen(false);

    logOut(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logged out",
          description: "Sign in again to see your photos",
          type: "success",
        });
        router.push("/signin");
      },
      onError: (err) => {
        toast.add({
          title: "Logout failed",
          description: errorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <nav className="navbar-header">
      {/* ------left brand and mobile hamburger */}
      <div className="navbar-brand">
        {/* -----hamburger, toggles mobile sidebar through context */}
        <button
          type="button"
          className="navbar-menu-btn"
          title="toggle menu"
          aria-label="Toggle navigation menu"
          onClick={toggleSidebar}
        >
          <MenuIcon className="size-5" />
        </button>
        <Image src={"/logo.png"} alt="logo" width={32} height={32} />
        <h1 className="navbar-brand-text">Pixtos</h1>
      </div>

      {/* -----center search bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="navbar-search-wrapper">
          <SearchIcon className="size-4 text-slate-500 shrink-0 mr-2 sm:mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos, videos...."
            className="navbar-search-input"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition p-0.5"
            >
              <XIcon className="size-3.5 sm:size-4 text-slate-800" />
            </button>
          ) : (
            <div className="navbar-ai-badge">
              AI-Powerd Search{" "}
              <SparkleIcon className="size-3.5 animate-spin text-slate-600 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* ------right action button: upload and profile */}

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* -----upload button, opens upload modal through context */}
        <button
          type="button"
          className="navbar-upload-btn"
          onClick={openUpload}
        >
          <UploadIcon className="size-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* ----user profile menu */}
        {userDataLoading ? (
          // -----loading user, grey circle in the avatar's place
          <div className="size-8 sm:size-9 rounded-full bg-slate-200 animate-pulse shrink-0" />
        ) : !user ? (
          // -----not logged in (or session expired)
          <Link
            href="/signin"
            className="text-xs font-semibold text-slate-900 hover:underline shrink-0"
          >
            Sign in
          </Link>
        ) : (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="navbar-avatar-btn overflow-hidden"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={36}
                  height={36}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                initials
              )}
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown p-2 shadow-lg" role="menu">
                {/* name and email */}
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>

                {/* profile */}
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition"
                >
                  <UserIcon className="size-4" />
                  Profile
                </Link>

                {/* logout */}
                <button
                  type="button"
                  role="menuitem"
                  className="navbar-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
