import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import PhoneVerificationModel from "../models/PhoneVerificationModel.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokensCookies.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import UserRefreshTokenModel from "../models/UserRefreshToken.js";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import otplessClient from "../config/otplessConfig.js";

class UserController {
  // Send Phone Verification OTP via OTPless
  static sendPhoneVerificationOTP = async (req, user) => {
    try {
      const { phoneNumber, countryCode } = user;
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      console.log("Sending OTP to:", fullPhoneNumber);

      const orderId = await otplessClient.sendOTP(fullPhoneNumber);
      console.log("OTPless response:", orderId);

      await PhoneVerificationModel.create({
        userId: user._id,
        orderId,
      });
      console.log("Phone verification record created for user:", user._id);

      return orderId;
    } catch (error) {
      console.error("Error in sendPhoneVerificationOTP:", error);
      throw new Error(`Failed to send phone OTP: ${error.message}`);
    }
  };

  // Step 0: Initial Registration (Phone OTP)
  static userRegistration = async (req, res) => {
    try {
      console.log("Request received at /api/user/register:", req.body);
      const { fullName, phoneNumber, countryCode, areaPin, locality, city, state } = req.body;

      if (!fullName || !phoneNumber || !countryCode || !areaPin || !locality || !city || !state) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }

      console.log("Checking for existing user with phone:", phoneNumber, countryCode);
      const existingUserByPhone = await UserModel.findOne({ phoneNumber, countryCode });
      if (existingUserByPhone) {
        return res.status(409).json({ 
          status: "failed", 
          message: "Phone number is already registered" 
        });
      }

      console.log("Creating new user...");
      const newUser = await new UserModel({
        name: fullName,
        phoneNumber,
        countryCode,
        areaPin,
        locality,
        city,
        state,
        is_phone_verified: false,
        is_verified: false,
      }).save();
      console.log("New user created:", newUser._id);

      console.log("Sending phone OTP...");
      const orderId = await this.sendPhoneVerificationOTP(req, newUser);
      console.log("Phone OTP sent, orderId:", orderId);

      res.status(201).json({
        status: "success",
        message: "Phone OTP sent. Please verify your phone.",
        user: { id: newUser._id, phoneNumber: newUser.phoneNumber },
        orderId,
      });
    } catch (error) {
      console.error("Error in userRegistration:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to register, please try again later",
      });
    }
  };

  // Verify Phone OTP with OTPless
  static verifyPhone = async (req, res) => {
    try {
      const { phoneNumber, countryCode, otp, orderId } = req.body;

      if (!phoneNumber || !countryCode || !otp || !orderId) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const existingUser = await UserModel.findOne({ phoneNumber, countryCode });

      if (!existingUser) {
        return res.status(404).json({ status: "failed", message: "Phone number doesn't exist" });
      }

      if (existingUser.is_phone_verified) {
        return res.status(400).json({ status: "failed", message: "Phone is already verified" });
      }

      const phoneVerification = await PhoneVerificationModel.findOne({
        userId: existingUser._id,
        orderId,
      });

      if (!phoneVerification) {
        const newOrderId = await this.sendPhoneVerificationOTP(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "Invalid or expired orderId, new OTP sent to your phone",
          orderId: newOrderId,
        });
      }

      const isVerified = await otplessClient.verifyOTP(fullPhoneNumber, otp, orderId);
      if (isVerified) {
        existingUser.is_phone_verified = true;
        await existingUser.save();

        await PhoneVerificationModel.deleteMany({ userId: existingUser._id });

        const { accessToken } = await generateTokens(existingUser); // Temporary token for Step 1
        res.status(200).json({
          status: "success",
          message: "Phone verified successfully. Proceed to email verification.",
          phoneAuth: accessToken,
        });
      } else {
        const newOrderId = await this.sendPhoneVerificationOTP(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "Invalid OTP, new OTP sent to your phone",
          orderId: newOrderId,
        });
      }
    } catch (error) {
      console.error("Error in verifyPhone:", error.stack);
      res.status(500).json({
        status: "failed",
        message: `Unable to verify phone: ${error.message}`,
      });
    }
  };

  // Step 1: Send Email OTP
  static sendEmailOtp = async (req, res) => {
    try {
      const { email, password, phoneNumber, countryCode } = req.body;

      if (!email || !password || !phoneNumber || !countryCode) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ phoneNumber, countryCode });
      if (!existingUser || !existingUser.is_phone_verified) {
        return res.status(400).json({ status: "failed", message: "Phone number not verified" });
      }

      // Check if email is already registered with another user
      const emailAlreadyRegistered = await UserModel.findOne({ 
        email, 
        _id: { $ne: existingUser._id } // Exclude current user
      });
      if (emailAlreadyRegistered) {
        return res.status(409).json({ 
          status: "failed", 
          message: "Email is already registered" 
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);

      existingUser.email = email; // Overwrite or set email
      existingUser.password = hashedPassword; // Overwrite or set password
      await existingUser.save();

      await sendEmailVerificationOTP(req, existingUser);

      res.status(200).json({
        status: "success",
        message: "Email OTP sent. Please verify your email.",
        user: { id: existingUser._id, email: existingUser.email },
      });
    } catch (error) {
      console.error("Error in sendEmailOtp:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to send email OTP, please try again later",
      });
    }
  };

// Verify Email OTP
static verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
    }

    if (existingUser.is_verified) {
      return res.status(400).json({ status: "failed", message: "Email is already verified" });
    }

    const emailVerification = await EmailVerificationModel.findOne({
      userId: existingUser._id,
      otp,
    });
    if (!emailVerification) {
      await sendEmailVerificationOTP(req, existingUser);
      return res.status(400).json({
        status: "failed",
        message: "Invalid OTP, new OTP sent to your email",
      });
    }

    const currentTime = new Date();
    const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
    if (currentTime > expirationTime) {
      await sendEmailVerificationOTP(req, existingUser);
      return res.status(400).json({
        status: "failed",
        message: "OTP expired, new OTP sent to your email",
      });
    }

    existingUser.is_verified = true;
    await existingUser.save();

    await EmailVerificationModel.deleteMany({ userId: existingUser._id });

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(existingUser);
    setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

    res.status(200).json({
      status: "success",
      message: "Email verified and registration completed successfully",
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_exp: accessTokenExp,
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error.stack);
    res.status(500).json({
      status: "failed",
      message: "Unable to verify email, please try again later",
    });
  }
};

  // User Login
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required",}
          )};

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }

      if (!user.is_verified) {
        return res.status(401).json({ status: "failed", message: "Your email is not verified" });
      }

      if (!user.is_phone_verified) {
        const orderId = await this.sendPhoneVerificationOTP(req, user);
        return res.status(401).json({
          status: "failed",
          message: "Your phone is not verified. OTP sent to your phone.",
          orderId,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: "failed", message: "Invalid email or password" });
      }

      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);
      setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
          isGISRegistered: user.isGISRegistered || false,
        },
        status: "success",
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true,
      });
    } catch (error) {
      console.error("Error in userLogin:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to login, please try again later",
      });
    }
  };

  // Get New Access Token OR Refresh Token
  static getNewAccessToken = async (req, res) => {
    try {
      const { newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp } =
        await refreshAccessToken(req, res);
      setTokensCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp);

      res.status(200).send({
        status: "success",
        message: "New tokens generated",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        access_token_exp: newAccessTokenExp,
      });
    } catch (error) {
      console.error("Error in getNewAccessToken:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to generate new token, please try again later",
      });
    }
  };

  // Profile OR Logged in User
  static userProfile = async (req, res) => {
    res.send({ user: req.user });
  };

  // Change Password
  static changeUserPassword = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;
      if (!password || !password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password are required",
        });
      }
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password don't match",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } });
      res.status(200).json({ status: "success", message: "Password changed successfully" });
    } catch (error) {
      console.error("Error in changeUserPassword:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to change password, please try again later",
      });
    }
  };

  // Send Password Reset Link via Email
  static sendUserPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: "failed", message: "Email field is required" });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
      }
      const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Hello ${user.name},</p><p>Please <a href="${resetLink}">click here</a> to reset your password.</p>`,
      });
      res.status(200).json({
        status: "success",
        message: "Password reset email sent. Please check your email.",
      });
    } catch (error) {
      console.error("Error in sendUserPasswordResetEmail:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to send password reset email. Please try again later",
      });
    }
  };

  // Password Reset
  static userPasswordReset = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;
      const { id, token } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }
      const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      jwt.verify(token, new_secret);
      if (!password || !password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password are required",
        });
      }
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "New Password and Confirm New Password don't match",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });
      res.status(200).json({ status: "success", message: "Password reset successfully" });
    } catch (error) {
      console.log("Error in userPasswordReset:", error.stack);
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "failed",
          message: "Token expired. Please request a new password reset link.",
        });
      }
      return res.status(500).json({
        status: "failed",
        message: "Unable to reset password. Please try again later",
      });
    }
  };

  // Logout
  static userLogout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      await UserRefreshTokenModel.findOneAndUpdate(
        { token: refreshToken },
        { $set: { blacklisted: true } }
      );
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.clearCookie("is_auth");
      res.status(200).json({ status: "success", message: "Logout successful" });
    } catch (error) {
      console.error("Error in userLogout:", error.stack);
      res.status(500).json({
        status: "failed",
        message: "Unable to logout, please try again later",
      });
    }
  };

  //apply approval
  // static applyApproval=async(req,res)=>{
  //   try{
  //     const Id = req.user._id;
  //     const user=await UserModel.findById(Id);
  //     (!user){

  //     }
  //     user.isApplied=true;
  //     user.status="review"
  //     await user.save()
  //     return res.json({

  //     })

  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  
}

export default UserController;