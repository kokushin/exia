import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  return <div className="relative max-h-[100svh] min-h-[100svh] overflow-hidden select-none">{children}</div>;
};
