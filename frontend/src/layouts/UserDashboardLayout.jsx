import { Outlet } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineCreditCard,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import DashboardSidebar from "../components/DashboardSidebar";

const items = [
  { label: "Overview", to: "", icon: HiOutlineSquares2X2 },
  { label: "Find an Expert", to: "/experts", icon: HiOutlineMagnifyingGlass, external: true },
  { label: "My Bookings", to: "/bookings", icon: HiOutlineClipboardDocumentList },
  { label: "Upcoming Sessions", to: "/sessions", icon: HiOutlineCalendarDays },
  { label: "Messages", to: "/messages", icon: HiOutlineChatBubbleLeftRight },
  { label: "Favorite Experts", to: "/favorites", icon: HiOutlineHeart },
  { label: "Reviews", to: "/reviews", icon: HiOutlineStar },
  { label: "Payments", to: "/payments", icon: HiOutlineCreditCard },
  { label: "Notifications", to: "/notifications", icon: HiOutlineBell },
  { label: "Profile", to: "/profile", icon: HiOutlineUserCircle },
  { label: "Settings", to: "/settings", icon: HiOutlineCog6Tooth },
];

export default function UserDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar items={items} basePath="/dashboard" roleLabel="My Dashboard" />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
