"use client";
import NavBar from "@/components/NavBar";

export default function AboutLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
