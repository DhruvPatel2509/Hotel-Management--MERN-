import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    // Check if Clerk passed userId in req.auth
    const { userId } = req.auth || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Fetch user from MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};
