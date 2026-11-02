import type { ReactNode } from "react";
import GlobalModals from "@/components/layout/GlobalModals";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { UIProvider } from "@/providers/UIProvider";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    // -----UIProvider shares sidebar & modal state with everything inside it
    <UIProvider>
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <Navbar />
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          <Sidebar />
          {/* -----page content */}
          <div className="app-main-content">{children}</div>
        </div>
      </div>

      {/* -----upload & create album modals, rendered once */}
      <GlobalModals />
    </UIProvider>
  );
};

export default layout;
