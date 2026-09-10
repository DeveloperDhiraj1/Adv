import { Outlet } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineUserCircle,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineStar,
  HiOutlineBanknotes,
  HiOutlineDocumentCheck,
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import DashboardSidebar from "../components/DashboardSidebar";

const items = [
  { label: "Overview", to: "", icon: HiOutlineSquares2X2 },
  { label: "My Profile", to: "/profile", icon: HiOutlineUserCircle },
  { label: "My Services", to: "/services", icon: HiOutlineBriefcase },
  { label: "Calendar", to: "/calendar", icon: HiOutlineCalendarDays },
  { label: "Appointments", to: "/appointments", icon: HiOutlineClipboardDocumentList },
  { label: "Messages", to: "/messages", icon: HiOutlineChatBubbleLeftRight },
  { label: "Reviews", to: "/reviews", icon: HiOutlineStar },
  { label: "Earnings", to: "/earnings", icon: HiOutlineBanknotes },
  { label: "Credentials", to: "/credentials", icon: HiOutlineDocumentCheck },
  { label: "Notifications", to: "/notifications", icon: HiOutlineBell },
  { label: "Settings", to: "/settings", icon: HiOutlineCog6Tooth },
];

export default function ExpertDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar items={items} basePath="/expert-dashboard" roleLabel="Expert Dashboard" />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
