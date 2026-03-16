export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma specific errors
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ message: "A record with that value already exists" });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ message: "Referenced record does not exist" });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
};