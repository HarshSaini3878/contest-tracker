import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./utils/dbConnect.js"; // Import DB connection function
import Contest from "./models/contestModel.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


await dbConnect();


app.get("/api/contests", async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    res.json({ success: true, data: contests });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error fetching contests", error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
