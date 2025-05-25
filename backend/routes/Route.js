import express from "express";
import multer from "multer";
import path from "path";
import { Register, Login, refreshToken, logout } from "../controllers/UsersController.js";
import { LoginAdmin, LogoutAdmin, RegisterAdmin } from "../controllers/AdminController.js";
import { createForm, getAllForms, updateFormStatus } from "../controllers/FormController.js";
import { updateForm, deleteForm } from "../controllers/FormController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/adminOnly.js";
import { getFormsByUser } from "../controllers/FormController.js";

const router = express.Router();

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: multer.memoryStorage() });

// Auth routes
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// Admin routes
router.post("/admin/login", LoginAdmin);
router.post("/admin/create", RegisterAdmin);
router.delete("/admin/logout", LogoutAdmin);

// Form routes
router.post("/form", verifyToken, upload.single("bukti"), createForm);
router.get("/admin/form", verifyAdmin, getAllForms);
router.get("/user/form", verifyToken, getFormsByUser);
router.patch("/form/:id/status", verifyAdmin, updateFormStatus);
router.put("/form/:id", verifyToken, upload.single("bukti"), updateForm);
router.delete("/form/:id", verifyToken, deleteForm);

export default router;
