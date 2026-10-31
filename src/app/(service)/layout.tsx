import Navbar from "@/components/layout/Navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar/>
      <p>sidebar</p>
      <div className="app-main-content">{children}</div>
      <p>footer</p>
    </div>
  );
};

export default layout;
