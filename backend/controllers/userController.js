import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import authUser from '../middleware/auth.js';


const createToken=(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}



// route for user login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success:false, message:"User Not Exists"})
        }
        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.json({success:false, message:`Account locked. Try again later.`})
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (isMatch) {
            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
            user.failedLoginAttempts = 0;
            await user.save();
            // Send OTP email
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: "Your Login OTP",
                html: `<p>Your OTP for login is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
            };
            await transporter.sendMail(mailOptions);
            return res.json({success:true, mfa: true, message: "OTP sent to your email."})
        } else {
            // Increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            // Lock account after 5 failed attempts for 15 min
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000;
            }
            await user.save();
            return res.json({success:false, message: 'Invalid Credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// route for user regsiter

const registerUser = async (req, res) => {

    try {
        const {name, email, password} = req.body;

        // checking user alredy exists or not
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message:"User Already Exists"})
        }
        // validating email formad and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"please enter a valid email"})
        }
        // Strong password policy
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongPassword.test(password)) {
            return res.json({success:false, message:"Password must be at least 8 characters and include uppercase, lowercase, number, and special character."})
        }

        //hashing user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({success:true, token})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"invalid credits"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// Forgot Password Controller
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 3600000; // 1 hour
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiry;
        await user.save();
        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const resetLink = `http://localhost:5173/reset-password/${token}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Password reset link sent to your email." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Reset Password Controller
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }
        const salt = await bycrypt.genSalt(10);
        user.password = await bycrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ success: true, message: "Password has been reset successfully.", email: user.email });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// MFA OTP verification endpoint
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.json({ success: false, message: "OTP expired or not requested" });
        }
        if (user.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        // OTP valid
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const token = createToken(user._id);
        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// MFA resend OTP endpoint
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.json({ success: false, message: "Account locked. Try again later." });
        }
        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
        await user.save();
        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Your Login OTP (Resent)",
            html: `<p>Your new OTP for login is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "OTP resent to your email." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get current user's profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select('-password -passwordHistory -otp -otpExpires -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update current user's profile
const updateProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const { name, email, deliveryAddress, password } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (deliveryAddress) user.deliveryAddress = deliveryAddress;
        if (password) {
            // Strong password policy
            const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            if (!strongPassword.test(password)) {
                return res.json({ success: false, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
            }
            // Prevent password reuse (last 5)
            const bcrypt = await import('bcrypt');
            const prevHashes = user.passwordHistory.slice(-5);
            for (let hash of prevHashes) {
                if (await bcrypt.compare(password, hash)) {
                    return res.json({ success: false, message: 'You cannot reuse a recent password.' });
                }
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Add current password to history
            user.passwordHistory.push(user.password);
            user.password = hashedPassword;
        }
        await user.save();
        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, verifyOtp, resendOtp, getProfile, updateProfile }