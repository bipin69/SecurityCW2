import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        console.log('Admin Auth - Received token:', token);
        console.log('Admin Auth - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
        
        if(!token){
            console.log('Admin Auth - No token provided');
            return res.json({success:false, message:"Not authorized login again"})
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Admin Auth - Decoded token:', token_decode);
        console.log('Admin Auth - Expected:', process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        
        // The token payload should match ADMIN_EMAIL + ADMIN_PASSWORD
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            console.log('Admin Auth - Token mismatch');
            return res.json({success:false, message:"Not authorized login again"})
        }
        
        console.log('Admin Auth - Success');
        next()
    } catch (error) {
        console.log('Admin Auth - Error:', error.message);
        res.json({success:false, message:error.message})
    }
}

export default adminAuth