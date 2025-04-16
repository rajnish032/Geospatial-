const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
  const now = Math.floor(Date.now() / 1000);
  const accessTokenMaxAge = (newAccessTokenExp - now) * 1000;
  const refreshTokenMaxAge = (newRefreshTokenExp - now) * 1000;
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: accessTokenMaxAge,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: refreshTokenMaxAge,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: isProduction,
    maxAge: refreshTokenMaxAge,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  console.log("Cookies set:", {
    accessToken: accessToken.slice(0, 20) + "...",
    refreshToken: refreshToken.slice(0, 20) + "...",
    isProduction,
  });
};

export default setTokensCookies;