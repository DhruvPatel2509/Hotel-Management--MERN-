import { v2 as cloudinary } from "cloudinary";
import Hotel from "../model/Hotel.js";
import Room from "../model/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Find hotel of this owner
    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel found",
      });
    }

    // Upload images to Cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path, {
        folder: "hotel_management/rooms",
      });
      return response.secure_url;
    });

    // Wait until all uploads finish
    const images = await Promise.all(uploadImages);

    // Create room in DB
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: JSON.parse(amenities), // frontend sends JSON string
      images,
    });

    return res.json({
      success: true,
      message: "Room created successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all available rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image", // return only owner image
        },
      })
      .sort({ createdAt: -1 }); // latest first

    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all rooms of the logged-in hotel owner
export const getOwnerRooms = async (req, res) => {
  try {
    // 1. Find the hotel created by the logged-in user
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.json({
        success: false,
        message: "No Hotel found for this owner",
      });
    }

    // 2. Find all rooms of this hotel
    const rooms = await Room.find({ hotel: hotelData._id })
      .populate("hotel") // Show hotel details inside each room
      .sort({ createdAt: -1 }); // Latest rooms first

    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// Toggle a room's availability (owner-only)
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: "roomId is required" });
    }

    // Fetch room
    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Toggle and save
    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.json({
      success: true,
      message: "Room availability updated",
      room: {
        _id: room._id,
        isAvailable: room.isAvailable,
      },
    });
  } catch (error) {
    console.error("toggleRoomAvailability error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
