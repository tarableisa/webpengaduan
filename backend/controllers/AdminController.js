import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Admin
export const RegisterAdmin = async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const data = await Admin.create({
      username,
      password: hashPassword,
    });

    res.status(201).json({
      message: "Admin berhasil dibuat",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Login Admin
export const LoginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const accessToken = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Admin.update(
      { refresh_token: refreshToken },
      { where: { id: admin.id } }
    );

    res.cookie("refreshTokenAdmin", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      message: "Login admin berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Refresh Token
export const refreshTokenAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin;
    if (!refreshToken) return res.sendStatus(401);

    const admin = await Admin.findOne({ where: { refresh_token: refreshToken } });
    if (!admin) return res.status(403).json({ message: "Admin tidak ditemukan" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const { id, username } = admin;
      const accessToken = jwt.sign(
        { id, username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Logout Admin
export const LogoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin;
    if (!refreshToken) return res.sendStatus(204);

    const admin = await Admin.findOne({ where: { refresh_token: refreshToken } });
    if (!admin) return res.sendStatus(204);

    await Admin.update({ refresh_token: null }, { where: { id: admin.id } });
    res.clearCookie("refreshTokenAdmin");

    res.status(200).json({
      message: "Logout admin berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};
