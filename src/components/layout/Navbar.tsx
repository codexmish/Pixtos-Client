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
import { useEffect, useRef, useState } from "react";


// --------dummy user data
const user = {name: "John Dow", email: "dummy@gmaial.com"}

// --------avatar initials, e.g. "John Dow" -> "JD"
const initials = user.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  // const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

  // -----logout (demo for now)
  const handleLogout = () => {
    setDropdownOpen(false);
    console.log("logout");
  };

  return (
    <nav className="navbar-header">
      {/* ------left brand and mobile hamburger */}
      <div className="navbar-brand">
        <button
          type="button"
          className="navbar-menu-btn"
          title="toggle menu"
          aria-label="Toggle navigation menu"
        >
          <MenuIcon className="size-5" />
        </button>
        <Image src={"/logo.png"} alt="logo" width={32} height={32} />
        <h1 className="navbar-brand-text">Pixtos</h1>
      </div>

      {/* 
        <Navbar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onUploadClick={() => setIsUploadOpen(true)}
  onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
/>
        */}

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
        {/* upload button */}
        <button
          type="button"
          className="navbar-upload-btn"
          onClick={() => setIsUploadOpen(true)}
        >
          <UploadIcon className="size-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* ----user profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="navbar-avatar-btn"
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown p-2 shadow-lg" role="menu">
              {/* name and email */}
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
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
      </div>
    </nav>
  );
};

export default Navbar;
