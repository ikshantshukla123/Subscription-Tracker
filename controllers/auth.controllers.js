import mongoose from "mongoose";
import User from '../models/user.model.js'
import bcrypt from "bcrypt"
import { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_SECRET,JWT_EXPIRE_IN, NODE_ENV} from '../config/env.js'



export const signUp = async (req , res , next)=>{
    const session = await mongoose.startSession();
   session.startTransaction();
   try{
    const {email,name,password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        const error = new Error("USer already exists");
        error.statusCode = 409;

        throw error;
    }

    //hash password
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUsers = await User.create([{  name,email,password:hashedPassword}],{session} );


    const token = jwt.sign({userId: newUsers[0]._id},JWT_SECRET,   {expiresIn:JWT_EXPIRE_IN});
    
    await session.commitTransaction();
    session.endSession();
    //__________________________________________________

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
//_____________________________________________________________________
res.redirect("/dashboard");
   // res.status(201).json({ success: true, data:{user:newUsers[0],token},message:"user created successfully"});

   }
   catch(error){
   await  session.abortTransaction();
   session.endSession();
   next(error);
   }

}


export const signIn = async (req , res , next)=>{
  try{
    const {password,email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        const error = new Error("user not find");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        const error = new Error("Invalid password");
        error.statusCode = 401;
        throw error
    }

    const token = jwt.sign({userId: user._id},JWT_SECRET,   {expiresIn:JWT_EXPIRE_IN});
        // Set token as HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure:NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
        console.log("Signed in, sending cookie with token:", token);

        res.redirect("/dashboard");
   // res.status(201).json({ success: true, data:{user,token},message:"user signed in successfully"});

  }catch(error){
    next(error);
  }
}



export const signOut = async (req , res , next)=>{
  res.clearCookie('token');
  res.redirect('/');
}

