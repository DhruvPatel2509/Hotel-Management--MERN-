// controllers/clerkWebhooks.js
import User from "../model/User.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
  try {
    // Raw body from Express bodyParser.raw()
    const rawBody = req.body.toString("utf8");

    // Svix Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify Webhook
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(rawBody, headers);

    const { type, data } = evt;

    // Construct DB user object
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
      role: "user",
      recentSearchedCities: [],
    };

    // Handle Clerk Webhook Events
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("Unhandled Clerk Webhook:", type);
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error.message);
    return res
      .status(400)
      .json({ success: false, error: "Invalid webhook signature" });
  }
};
