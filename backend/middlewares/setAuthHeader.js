import isTokenExpired from "../utils/isTokenExpired.js";

const setAuthHeader = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken && !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    next();
  } catch (error) {
    console.error("Error setting auth header:", error.message);
    res.status(401).json({
      success: false,
      message: "Failed to set authorization header",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

export default setAuthHeader;
