"use client";

import {
  MenuIcon,
  SearchIcon,
  SparkleIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";


// --------dummy user data
const user = {name: "John Dow", email: "dummy@gmaial.com"}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      </div>
    </nav>
  );
};

export default Navbar;
