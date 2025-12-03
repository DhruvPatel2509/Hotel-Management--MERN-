import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "❌ Missing MONGODB_URI in environment. Check your .env file."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
