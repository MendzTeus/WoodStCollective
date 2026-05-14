/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Spaces from "./pages/Spaces";
import RoomDetail from "./pages/RoomDetail";
import Coworking from "./pages/Coworking";
import About from "./pages/About";
import Amenities from "./pages/Amenities";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coliving" element={<Spaces />} />
          <Route path="/coliving/:id" element={<RoomDetail />} />
          <Route path="/coworking" element={<Coworking />} />
          <Route path="/about" element={<About />} />
          <Route path="/amenities" element={<Amenities />} />
        </Routes>
      </Layout>
    </Router>
  );
}
