import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBooking";
import { Toaster } from "react-hot-toast";

import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import Hotelreg from "./pages/Hotelreg";
import AddRoom from "./pages/AddRoom";
import About from "./pages/About";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  const { getToken } = useAuth();

  // 🔥 Console log Clerk Token for Postman
  useEffect(() => {
    async function showToken() {
      try {
        const token = await getToken();
        console.log("🔥 YOUR CLERK TOKEN:", token);
      } catch (error) {
        console.error("Error getting Clerk token:", error);
      }
    }

    showToken();
  }, [getToken]);

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/hotel-reg" element={<Hotelreg />} />
          <Route path="/add-rooms" element={<AddRoom />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
