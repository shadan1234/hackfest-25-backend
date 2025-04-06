import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
};

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      phone
    });

    await newUser.save();

    res.status(200).json({ 
      success: true, 
      message: "User created successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error, try again" 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove sensitive data before sending response
    const { password: userPassword, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: userData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
};

export const logout = async (req, res) => {
  try {
    // In a token-based authentication system, logout happens client-side
    // by removing the token from storage
    
    // For enhanced security, you could implement a token blacklist
    // This would require additional backend storage like Redis
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
