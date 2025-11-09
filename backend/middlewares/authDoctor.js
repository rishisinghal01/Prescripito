import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    // ✅ Read token safely from headers
    const token =
      req.headers.dtoken ||
      req.headers.dToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization Required: Token Missing",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Attach doctor ID to request
    req.docId = decoded.id;

    // ✅ Continue
    next();
  } catch (error) {
    console.error("AuthDoctor Error:", error.message);
    res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Invalid or Expired Token",
    });
  }
};

export default authDoctor;
