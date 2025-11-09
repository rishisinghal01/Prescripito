import jwt from "jsonwebtoken";

const authuser = async (req, res, next) => {
  try {
    // ✅ Read token from headers (case-insensitive)
    const token =
      req.headers.token || req.headers.Token || req.headers.authorization;

    if (!token) {
      return res.json({
        success: false,
        message: "Authorization Required: Token Missing",
      });
    }

    // ✅ Verify JWT
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Attach userId to req object (works for GET, POST, PUT, DELETE)
    req.userId = decode.id;

    // ✅ Move to next middleware / controller
    next();

  } catch (error) {
    console.error("Auth Error:", error.message);
    res.json({
      success: false,
      message: "Authorization Required: Invalid or Expired Token",
    });
  }
};

export default authuser;
