import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../models/UserRefreshToken.js";

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );
    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    const accessTokenExp = decodedAccess.exp;
    const refreshTokenExp = decodedRefresh.exp;

    await UserRefreshTokenModel.findOneAndDelete({ userId: user._id });
    await new UserRefreshTokenModel({
      userId: user._id,
      token: refreshToken,
    }).save();

    return {
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp,
    };
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export default generateTokens;
