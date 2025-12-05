import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth();
    // if (typeof req.auth === "function") {
    //   console.log("3. Auth Object:", req.auth());
    // }
    // if (auth.debug) {
    //   console.log("🛑 CLERK DEBUG REASON:", auth.debug());
    // }
    const { userId } = req.auth();

    // console.log(userId);

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
