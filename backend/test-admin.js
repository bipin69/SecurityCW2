import jwt from 'jsonwebtoken';
import 'dotenv/config';

console.log('Testing Admin Authentication...');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.JWT_SECRET) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const secret = process.env.JWT_SECRET;
    
    // Create token like in adminLogin
    const token = jwt.sign(email + password, secret);
    console.log('Generated Token:', token);
    
    // Verify token like in adminAuth
    const decoded = jwt.verify(token, secret);
    console.log('Decoded Token:', decoded);
    
    // Check if they match
    const expected = email + password;
    console.log('Expected:', expected);
    console.log('Decoded:', decoded);
    console.log('Match:', decoded === expected);
} else {
    console.log('Missing environment variables!');
} 