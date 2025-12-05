// server.js

// 1. CRITICAL: Load env vars before ANY other imports
import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Clerk imports
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/clerkWebhooks.js";

// Route imports
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.route.js";

const app = express();

// 2. Connect Infrastructure
connectDB();
connectCloudinary();
const Frontendurl = process.env.FRONTEND_URL;
console.log(`Frontendurl= ${Frontendurl}`);

// 3. CORS Configuration
app.use(
  cors({
    origin: Frontendurl, // Ensure this matches your frontend port exactly
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4. Clerk Middleware
// This loads the auth state. It doesn't block routes, just adds req.auth
app.use(clerkMiddleware());

// 6. Webhooks Route
// ⚠️ MUST be before express.json() because webhooks need the raw body for signature verification
app.use("/api/clerk", clerkWebhooks);

// 7. Body Parser
// Now we parse JSON for all remaining routes
app.use(express.json());

// 8. API Routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// 9. Health Check
app.get("/", (_req, res) => res.send("API IS WORKING"));

// 10. 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
