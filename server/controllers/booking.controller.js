import Booking from "../model/Booking.js";
import Hotel from "../model/Hotel.js";
import Room from "../model/Room.js";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    // Check for existing bookings that overlap
    const bookings = await Booking.find({
      room,
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    });

    return bookings.length === 0;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // basic validation
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "room, checkInDate and checkOutDate are required",
      });
    }

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    return res.status(200).json({ success: true, isAvailable });
  } catch (error) {
    console.error("checkAvailabilityAPI:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    console.log(req.body);

    const user = req.user._id;

    // ---------- Validate input ----------
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.json({
        success: false,
        message: "Room, Check-In, Check-Out, and Guests are required",
      });
    }

    // ---------- Check room availability ----------
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available",
      });
    }

    // ---------- Fetch Room Data ----------
    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    let totalPrice = roomData.pricePerNight;

    // ---------- Calculate Nights ----------
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    // ---------- Create Booking ----------
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    return res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("createBooking Error:", error);

    return res.json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("getUserBookings Error:", error);

    res.json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    // Find hotel owned by this admin/owner
    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel found",
      });
    }

    // Fetch all bookings for this hotel
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room")
      .populate("hotel")
      .populate("user")
      .sort({ createdAt: -1 });

    // Total bookings count
    const totalBookings = bookings.length;

    // Total revenue calculation
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    return res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    console.error("getHotelBookings Error:", error);

    return res.json({
      success: false,
      message: "Failed to fetch hotel bookings",
    });
  }
};
