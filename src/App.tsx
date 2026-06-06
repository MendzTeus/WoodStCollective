/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Spaces from "./pages/Spaces";
import RoomDetail from "./pages/RoomDetail";
import Coworking from "./pages/Coworking";
import About from "./pages/About";
import Amenities from "./pages/Amenities";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPages from "./pages/admin/Pages";
import AdminRooms from "./pages/admin/Rooms";
import AdminRoomEditor from "./pages/admin/RoomEditor";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminBookings from "./pages/admin/Bookings";
import AdminRoom6DirectBooking from "./pages/admin/Room6DirectBooking";

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <AnalyticsTracker />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coliving" element={<Spaces />} />
              <Route path="/coliving/:id" element={<RoomDetail />} />
              <Route path="/coworking" element={<Coworking />} />
              <Route path="/about" element={<About />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/booking/cancel" element={<BookingCancel />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/pages" replace />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="rooms/:id" element={<AdminRoomEditor />} />
                <Route path="room6" element={<AdminRoom6DirectBooking />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}
