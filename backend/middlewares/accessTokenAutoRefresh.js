import refreshAccessToken from "../utils/refreshAccessToken.js";
import isTokenExpired from "../utils/isTokenExpired.js";
import setTokensCookies from "../utils/setTokensCookies.js";

const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken && !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } = await refreshAccessToken(req, res);
    setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);
    req.headers["authorization"] = `Bearer ${newAccessToken}`;
    next();
  } catch (error) {
    console.error("Access Token Auto Refresh Error:", error.message);
    res.status(401).json({
      success: false,
      message: error.message || "Failed to refresh access token",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

export default accessTokenAutoRefresh;
