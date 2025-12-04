import Hotel from "../model/Hotel.js";
import User from "../model/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    // Owner ID from protect middleware
    const owner = req.user._id;

    // Check if this user already registered a hotel
    const existingHotel = await Hotel.findOne({ owner });

    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel Already Registered",
      });
    }

    // Create new hotel
    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    // Update user role to hotelOwner
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
    });
  } catch (error) {
    console.error("Register Hotel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while registering hotel",
    });
  }
};
