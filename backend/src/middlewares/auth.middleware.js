import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';

export const verifyJWT = async(req , res , next) => {
    // we cant using a res in this function so we can replace it with _
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
        if(!token){
            return res.status(401).json("Unauthorize user");
        }
        let decodedUser = jwt.verify(token , process.env.JWT_ACCESS_SECRET);
        let user = await User.findById(decodedUser?.user.id).select("-password -refreshToken")
        if(!user){
            return res.status(401).json("invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
}