import jwt from 'jsonwebtoken'
import { catchAsyncError } from './catchAsyncError.js'
import ErrorHandler from '../Utils/ErrorHandler.js';
import {User} from '../Models/User.js';



export const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token) return next(new ErrorHandler("Not Logged In ",401))
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decode._id)
    next()

})
export const isAuthorized = catchAsyncError(async(req,res,next)=>{
    if(req.user.role!=="admin")
        return next(new ErrorHandler("You are are not authorized for this work"))


    next()

})