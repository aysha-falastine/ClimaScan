"use client";

import NavBar from "@/components/NavBar";

export default function PropertiesLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
