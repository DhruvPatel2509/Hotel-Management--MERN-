// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// DB + Cloudinary
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Clerk
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/clerkWebhooks.js";

// Routes
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.route.js";

const app = express();

// CONNECT DATABASE + CLOUDINARY
connectDB();
connectCloudinary();

const FRONTEND = process.env.FRONTEND_URL;
console.log("Frontend URL:", FRONTEND);

// CORS
app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Clerk Auth Middleware
app.use(clerkMiddleware());

// --------------------------------------------------------
//  ✔ RAW BODY ONLY ON WEBHOOK ROUTE
//  MUST be BEFORE express.json()
// --------------------------------------------------------
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhooks
);

// Parse JSON for ALL normal routes AFTER webhook
app.use(express.json());

// Your API Routes
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// Health Check
app.get("/", (req, res) => res.send("API is running..."));

// 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
