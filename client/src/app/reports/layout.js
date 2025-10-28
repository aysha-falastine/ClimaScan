import SidebarLayout from "@/components/SideBar";

export default function ReportsLayout({ children }) {
  // SidebarLayout is a client component, so we can render it directly
  return <SidebarLayout>{children}</SidebarLayout>;
}
