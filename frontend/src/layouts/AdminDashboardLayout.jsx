import { Outlet } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineTag,
  HiOutlineExclamationTriangle,
  HiOutlineCreditCard,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import DashboardSidebar from "../components/DashboardSidebar";

const items = [
  { label: "Overview", to: "", icon: HiOutlineSquares2X2 },
  { label: "Users", to: "/users", icon: HiOutlineUsers },
  { label: "Experts", to: "/experts", icon: HiOutlineBriefcase },
  { label: "Categories", to: "/categories", icon: HiOutlineTag },
  { label: "Disputes", to: "/disputes", icon: HiOutlineExclamationTriangle },
  { label: "Transactions", to: "/transactions", icon: HiOutlineCreditCard },
  { label: "Settings", to: "/settings", icon: HiOutlineCog6Tooth },
];

export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar items={items} basePath="/admin" roleLabel="Admin Panel" />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
