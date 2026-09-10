import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ExpertDashboardLayout from "./layouts/ExpertDashboardLayout";
import UserDashboardLayout from "./layouts/UserDashboardLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experts from "./pages/Experts";
import ExpertProfile from "./pages/ExpertProfile";
import CategoryListing from "./pages/CategoryListing";
import HowItWorks from "./pages/HowItWorks";
import Booking from "./pages/Booking";
import BecomeExpert from "./pages/BecomeExpert";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

import ExpertOverview from "./pages/expert-dashboard/Overview";
import ExpertProfileEdit from "./pages/expert-dashboard/Profile";
import ExpertServices from "./pages/expert-dashboard/Services";
import ExpertCalendar from "./pages/expert-dashboard/Calendar";
import ExpertAppointments from "./pages/expert-dashboard/Appointments";
import ExpertReviews from "./pages/expert-dashboard/Reviews";
import ExpertEarnings from "./pages/expert-dashboard/Earnings";
import ExpertCredentials from "./pages/expert-dashboard/Credentials";
import ExpertNotifications from "./pages/expert-dashboard/Notifications";

import UserOverview from "./pages/user-dashboard/Overview";
import UserBookings from "./pages/user-dashboard/Bookings";
import UserSessions from "./pages/user-dashboard/Sessions";
import UserFavorites from "./pages/user-dashboard/Favorites";
import UserReviews from "./pages/user-dashboard/Reviews";
import UserPayments from "./pages/user-dashboard/Payments";
import UserProfile from "./pages/user-dashboard/Profile";
import UserNotifications from "./pages/user-dashboard/Notifications";

import AdminOverview from "./pages/admin-dashboard/Overview";
import AdminUsers from "./pages/admin-dashboard/Users";
import AdminExperts from "./pages/admin-dashboard/Experts";
import AdminCategories from "./pages/admin-dashboard/Categories";
import AdminDisputes from "./pages/admin-dashboard/Disputes";
import AdminTransactions from "./pages/admin-dashboard/Transactions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site — Navbar + Footer via Outlet */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/experts/:id" element={<ExpertProfile />} />
          <Route path="/categories/:slug" element={<CategoryListing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/become-an-expert" element={<BecomeExpert />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
          <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
        </Route>

        {/* Expert dashboard — Sidebar via Outlet */}
        <Route
          path="/expert-dashboard"
          element={
            <ProtectedRoute allowedRoles={["EXPERT"]}>
              <ExpertDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ExpertOverview />} />
          <Route path="profile" element={<ExpertProfileEdit />} />
          <Route path="services" element={<ExpertServices />} />
          <Route path="calendar" element={<ExpertCalendar />} />
          <Route path="appointments" element={<ExpertAppointments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="reviews" element={<ExpertReviews />} />
          <Route path="earnings" element={<ExpertEarnings />} />
          <Route path="credentials" element={<ExpertCredentials />} />
          <Route path="notifications" element={<ExpertNotifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User dashboard — Sidebar via Outlet */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserOverview />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="sessions" element={<UserSessions />} />
          <Route path="messages" element={<Messages />} />
          <Route path="favorites" element={<UserFavorites />} />
          <Route path="reviews" element={<UserReviews />} />
          <Route path="payments" element={<UserPayments />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin dashboard — Sidebar via Outlet */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="experts" element={<AdminExperts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
