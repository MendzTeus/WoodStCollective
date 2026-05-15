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

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPages from "./pages/admin/Pages";
import AdminRooms from "./pages/admin/Rooms";
import AdminRoomEditor from "./pages/admin/RoomEditor";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";

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
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}
