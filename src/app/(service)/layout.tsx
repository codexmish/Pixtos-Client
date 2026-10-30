import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <p>navbar</p>
      <p>sidebar</p>
      <div className="app-main-content">{children}</div>
      <p>footer</p>
    </div>
  );
};

export default layout;
