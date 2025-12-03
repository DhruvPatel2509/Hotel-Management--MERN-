import User from "../model/User.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix instance using Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Extract body
    const { data, type } = req.body;

    // Construct User Data for MongoDB
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
      role: "user",
      recentSearchedCities: [],
    };

    // Handle Webhook Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    return res.json({
      success: true,
      message: "Webhook Received",
    });
  } catch (error) {
    console.log("❌ Webhook verification failed:", error.message);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }
};
