const API_BASE_URL = "http://localhost:5000/api/auth"; 

export const sendOtp = async (phone, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, type }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const verifyOtp = async (phone, otp, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, type }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Something went wrong" };
  }
};
