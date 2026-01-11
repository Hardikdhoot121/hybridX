import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone,classLevel,batch,targetYear } = req.body;

    // validation
    if (!name || !email || !password || !phone || !classLevel) {
      return res.status(400).json({
        success: false,
        message: "fill all the fields",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
       phone,
      classLevel,
      batch: batch || "Batch 1",          // default if not provided
      targetYear: targetYear || undefined // schema default applies
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for email:', email);

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log('👤 User found:', user.email);
    console.log('🔑 Is migrated student:', user.isMigratedStudent);
    console.log('🔑 Has changed default password:', user.hasChangedDefaultPassword);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('🔐 Password comparison result:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log('✅ Login successful for:', user.name);

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        classLevel: user.classLevel,
        batch: user.batch,
        targetYear: user.targetYear,
        isMigratedStudent: user.isMigratedStudent,
        hasChangedDefaultPassword: user.hasChangedDefaultPassword
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
