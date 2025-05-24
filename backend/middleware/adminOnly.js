import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    // Bisa dioptimalkan jika ada role di token payload
    if (!decoded.username || !decoded.username.startsWith("admin")) {
      return res.status(403).json({ message: "Akses hanya untuk admin" });
    }

    req.user = decoded;
    next();
  });
};
