import  {catchAsyncError} from '../Middlewares/catchAsyncError.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import {User} from '../Models/User.js'
import {Course} from '../Models/Course.js'
import { sendToken } from '../Utils/sendToken.js'
import { sendEmail } from '../Utils/SendEmail.js'
import crypto  from "crypto"
import cloudinary from"cloudinary"
import getDataUri from '../Utils/dataUri.js'






export const register =catchAsyncError(async(req,res,next)=>{
    const{name,email,password,} =req.body
    const file=req.file

    

    if(!name||!email||!password||!file)
        return next(new ErrorHandler('Please add all fields ',400))
    let user = await User.findOne({email})
    if(user)
        return next(new ErrorHandler("User already exists",409))
    const fileUri = getDataUri(file)
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)
    // upload file on cloudaniary
 user = await User.create({
    name,
    email,
    password,
    avatar:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
})
sendToken(res,user,"Registered Successfully",201)
})



export const Login= catchAsyncError(async(req,res,next)=>{
    const {password,email}= req.body
        if(!email||!password)
        return next(new ErrorHandler('Please add all fields ',400))

    const user = await User.findOne({email}).select("+password")

    if(!user) return next(new ErrorHandler("Incorrect email or password",401))

// const isMatch = await User.comparePassword(password)
const isMatch = await user.comparePassword(password);


if(!isMatch)
return next(new ErrorHandler("Incorrect email or password",401))

sendToken(res,user,`Welcome Back${user.name}`,201)
 

})


export const Logout =catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"Logout successfully"
    })
})
export const getMyProfile =catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id)
    res.status(200).json({
        success:true,
       user,
    })
})
export const changePassword =catchAsyncError(async(req,res,next)=>{
    const {newPassword,oldPassword}=req.body;
    if(!newPassword||!oldPassword)
        return next(new ErrorHandler('Please add all fields ',400))
    const user = await User.findById(req.user._id).select("+password")
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch)
        return next(new ErrorHandler('Old Password is Incorrect ',400))
    user.password=newPassword
    await user.save()
res.json({
    success:true,
    message:"Password updated successfully"

})


})
export const updateProfile =catchAsyncError(async(req,res,next)=>{
    const {name,email}=req.body;
   
    const user = await User.findById(req.user._id)
    
    user.name=name
    user.email=email
    await user.save()
res.json({
    success:true,
    message:"Profile updated successfully"

})


})

export const updateProfilePicture=catchAsyncError(async(req,res,next)=>{
    // cloudnairy work todo
    const user = await User.findById(req.user._id)


    
    const file=req.file
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    const fileUri = getDataUri(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)

    user.avatar=
    {
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
    user.save()
    res.status(200).json({
        success:true,
        message:"Profile Picture Updated Successfully "
    })
})


export const forgetPassword=catchAsyncError(async(req,res,next)=>{
    const {email} = req.body;
    
        const user = await User.findOne({email})
    if(!user)return next(new ErrorHandler("User not Found ",400))
        const resetToken= await user.getResetToken()
await user.save()
    // send viaemail
const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
console.log("Reset Password URL:", url);

   const message=` Click on the link to reset the password.${url}`
   await  sendEmail(user.email,"EduLinker reset password",message)

    
    res.status(200).json({
        success:true,
        message:`Reset token is sent via ${user.email}`
    });
});


export const resetPassword=catchAsyncError(async(req,res,next)=>{

    const {token} = req.params
    const resetPasswordToken=crypto.createHash("sha256").update(token).digest('hex')

    const user =await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt:Date.now()
        }
    })
    if(!user) return next(new ErrorHandler("Token is invalid or expired.",401))
const {password}=req.body
    user.password=password
    user.resetPasswordExpire=null
    user.resetPasswordToken=null
    await user.save()
    res.status(200).json({
        success:true,
        message:"Password changed successfully ",
    })
})


export const addToPlayList=catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user._id)

    const course=await Course.findById(req.body.id)

    if(!course) return next(new ErrorHandler("Invalid course id ",404))
        const itemExist=user.playlist.find((item)=>{
    if(item.course.toString()===course._id.toString()) return true
        })
        if(itemExist)return next(new ErrorHandler("Item already exist",409))
    user.playlist.push({
course:course._id,
poster:course.poster.url,
})
await user.save()
res.status(200).json({
    success:true,
    message:"Course added to playlist successfully ",
})


    
})
export const removeFromPlayList=catchAsyncError(async(req,res,next)=>{


    const user = await User.findById(req.user._id)

    const course=await Course.findById(req.query.id)

    if(!course) return next(new ErrorHandler("Invalid course id ",404))
        const newPlayList =user.playlist.filter((item)=>{
            if(item.course.toString()!==course._id.toString()) return true

        })
        user.playlist=newPlayList
   
await user.save()
res.status(200).json({
    success:true,
    message:"Course removed from  playlist successfully ",
})

})
export const getAllUsers=catchAsyncError(async(req,res,next)=>{
    const user= await User.find()

   
res.status(200).json({
    success:true,
    user,
})

})
export const updateUserRole=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.params.id)
    if(!user) return next(new ErrorHandler("Invalid user id",404))


    if(user.role==="user")  user.role="admin"
    else user.role="user"
    await user.save()


   
res.status(200).json({
    success:true,
    message:"Role Updated"
})

})
export const deleteUser=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.params.id)
    if(!user) return next(new ErrorHandler("Invalid user id",404))
await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    console.log("remove from the cloudniary")
    // cancel subscription
   await user.deleteOne()



   
res.status(200).json({
    success:true,
    message:"User Deleted"
})

})
export const deleteMyProfile=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user._id)
    if(!user) return next(new ErrorHandler("Invalid user id",404))
await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    console.log("remove from the cloudniary")
    // cancel subscription
   await user.deleteOne()



   
   res.status(200).cookie("token",null,{
    expires:new Date(Date.now())
}).json({
    success:true,
    message:"Profile is deleted successfully"
})

})

