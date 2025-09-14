import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { captainLogin, captainLogout, captainRegister, getcaptainProfile } from "../controllers/captain.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

router.post('/regsiter',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],captainRegister)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainLogin)

router.get('/profile',authUser,getcaptainProfile)
router.post('/logout',authUser,captainLogout)
export default router;