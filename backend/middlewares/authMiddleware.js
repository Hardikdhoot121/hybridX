import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // token usually comes in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // no token
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next(); // move to controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
