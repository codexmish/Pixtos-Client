import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar />
        <div className="app-main-content">{children}</div>
      </div>
    </div>
  );
};

export default layout;
