import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, verifyOtp, resendOtp, getProfile, updateProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/resend-otp', resendOtp)
userRouter.get('/profile', authUser, getProfile);
userRouter.put('/profile', authUser, updateProfile);

export default userRouter;