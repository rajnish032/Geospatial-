const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
  const now = Math.floor(Date.now() / 1000);
  const accessTokenMaxAge = (newAccessTokenExp - now) * 1000;
  const refreshTokenMaxAge = (newRefreshTokenExp - now) * 1000;
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: accessTokenMaxAge,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: refreshTokenMaxAge,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: refreshTokenMaxAge,
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: isProduction,
    maxAge: refreshTokenMaxAge,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: refreshTokenMaxAge,
  });

  if (!isProduction) {
    console.log("Cookies set:");
    console.log("AccessToken:", accessToken);
    console.log("RefreshToken:", refreshToken);
  }
};

export default setTokensCookies;