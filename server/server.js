import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/clerkWebhooks.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => res.send("API IS WORKING"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Running On ${PORT}`));

connectDB();
