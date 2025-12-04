import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.route.js";
dotenv.config();
const app = express();

connectDB();
connectCloudinary();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => res.send("API IS WORKING"));

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Running On ${PORT}`));
