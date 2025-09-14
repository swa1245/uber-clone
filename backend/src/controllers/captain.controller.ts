import captain from "../models/captain.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const captainRegister = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const { fullName, email, password, vehicle } = req.body;
        if(!fullName || !email || !password || !vehicle || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingCaptain = await captain.findOne({ email });
        if(existingCaptain){
            return res.status(400).json({message: "Captain already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCaptain = new captain({
            fullName,
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            }
        });
          const token = jwt.sign(
              { id: newCaptain._id },
              process.env.JWT_SECRET as string,
              {
                expiresIn: "7d",
              }
            );
            res.cookie("token", token, {
              httpOnly: true,
            });
        await newCaptain.save();

        return res.status(201).json({ message: "Captain registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const captainLogin = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingCaptain = await captain.findOne({ email }).select("+password");
        if(!existingCaptain){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password, existingCaptain.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign(
            { id: existingCaptain._id },
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
}

export const getcaptainProfile = async (req: Request, res: Response) => {

    try {
        const captainId = req.user.id;
        const captainProfile = await captain.findById(captainId);
        if(!captainProfile){
            return res.status(404).json({message: "Captain not found"});
        }
        return res.status(200).json({ captain: captainProfile });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const captainLogout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}