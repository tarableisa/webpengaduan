import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/Route.js";
import "./models/Associations.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
// Debug: Pastikan .env terbaca
console.log("PORT dari env   :", process.env.PORT);
console.log("DB_HOST dari env:", process.env.DB_HOST);

const app = express();


// === CORS Configuration ===
const corsOptions = {
  origin: [
    "https://proyekahirfe27-173-dot-if-b-08.uc.r.appspot.com", // frontend deploy
    "http://localhost:3001", // pengembangan lokal
  ],
  credentials: true, // untuk cookie/token
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Gunakan opsi CORS
app.options("*", cors(corsOptions)); // Tangani preflight request


app.use(cookieParser());
app.use(express.json());

// Serve folder upload
app.use("/uploads", express.static("uploads"));

// Routing
app.use("/api", router);

const PORT = process.env.PORT || 3000;

db.authenticate()
  .then(() => {
    console.log("Database connected...");
    return db.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database error:", error);
    process.exit(1); // Exit supaya container stop dan log jelas
  });

