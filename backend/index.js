import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/Route.js";
import "./models/Associations.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// ✅ Load environment variables dari secret mount
dotenv.config({ path: "/secrets/env/backend-env" });

// Debug log hanya di development
if (process.env.NODE_ENV !== "production") {
  console.log("▶️ PORT dari env   :", process.env.PORT);
  console.log("▶️ DB_HOST dari env:", process.env.DB_HOST);
}

const app = express();

// === CORS Configuration ===
const corsOptions = {
  origin: [
    "https://proyekahirfe27-173-dot-if-b-08.uc.r.appspot.com",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

db.authenticate()
  .then(() => {
    console.log("✅ Database connected");
    return db.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database synchronized");
  })
  .catch((err) => {
    console.error("⚠️ Database connection failed (but server stays up):", err);
  });
