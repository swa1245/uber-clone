import user from "../models/user.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }
    const existingUser = await user.findOne({ email }).select("+password");
    if(!existingUser){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d",
        }
    );
    res.cookie("token", token, {
        httpOnly: true,
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingUser = await user.findById(userId).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: existingUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const logoutUser = async(req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}