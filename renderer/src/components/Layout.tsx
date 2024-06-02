import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative bg-neutral-950 max-h-screen min-h-screen overflow-hidden select-none">{children}</div>
  );
};
