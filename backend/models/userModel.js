import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordHistory: { type: [String], default: [] }, // Store previous password hashes
    cartData: { type: Object, default: {} },
    deliveryAddress: { type: Object, default: {} },
    savedAddresses: { type: Array, default: [] },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // MFA fields
    otp: { type: String },
    otpExpires: { type: Date },
    // Brute-force/lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    // Role-based access
    role: { type: String, enum: ['user', 'admin', 'custom'], default: 'user' },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel