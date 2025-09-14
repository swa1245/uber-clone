import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName.firstName').notEmpty().withMessage('First name is required'),
],registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
], loginUser)

router.get('/profile',authUser,getUserProfile)

router.post('/logout',authUser,logoutUser)

export default router;