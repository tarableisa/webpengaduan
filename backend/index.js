import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/Route.js";
import "./models/Associations.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({   credentials: true,
  origin: 'http://localhost:3001',
 }));
app.use(cookieParser());
app.use(express.json());

// Serve folder upload
app.use("/uploads", express.static("uploads"));

// Routing
app.use("/api", router);

try {
  await db.authenticate();
  console.log("Database connected...");
  await db.sync({ alter: true  }); // alter: true agar auto update struktur
} catch (error) {
  console.error("Database error:", error);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
