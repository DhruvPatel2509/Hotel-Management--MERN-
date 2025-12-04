export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    return res.status(200).json({
      success: true,
      role,
      recentSearchedCities,
    });
  } catch (error) {
    console.error("Error in getUserData:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
    });
  }
};

export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;

    const user = req.user;

    if (!recentSearchedCity) {
      return res.status(400).json({
        success: false,
        message: "Missing city name in request body.",
      });
    }

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "City added successfully.",
    });
  } catch (error) {
    console.error("Error storing recent city:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while storing city.",
    });
  }
};
