import jwt from "jsonwebtoken";

const authadmin = async (req, res, next) => {
  try {

    const aToken =
      req.headers.atoken || req.headers.aToken || req.headers.Atoken;


    if (!aToken) {
      return res.json({
        success: false,
        message: "Authorization Required: Token Missing",
      });
    }

    const decode = jwt.verify(aToken, process.env.JWT_SECRET_KEY);

    if (decode.data === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      next();
    } else {
      return res.json({
        success: false,
        message: "Authorization Required: Invalid Token",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Authorization Required: Invalid or Expired Token",
    });
  }
};

export default authadmin;
