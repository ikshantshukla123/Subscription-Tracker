import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";


const authorize = async(req,res,next)=>{
    try{
    let token;

    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    // token = req.headers.authorization.split(" ")[1];
    // }

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }
  
      // ✅ Optional: fallback to Bearer header if needed
      else if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }
  

    if(!token){
        return res.status(401).json({message:'unauthorized'});
    }

    const decoded =  jwt.verify(token,JWT_SECRET);
   
     const user = await User.findById(decoded.userId);

     if(!user)  return res.status(401).json({message:'unauthorized'});

     req.user = user;

    next();


    }
    catch(errror){
        return res.status(401).json({message:'unauthorized' , error: error.message});
    
    }
}

export default authorize;