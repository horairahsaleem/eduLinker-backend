import { catchAsyncError } from "../Middlewares/catchAsyncError.js"
import { Course } from "../Models/Course.js"
import getDataUri from "../Utils/dataUri.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import cloudinary from"cloudinary"
export const getAllCourses = catchAsyncError(async (req,res,next)=>{
    const courses = await Course.find().select("-lectures");
    res.status(200).json({
        success:true,
        courses,

    })
})
export const createCourse = catchAsyncError(async (req,res,next)=>{
    const {title,description ,category,createdby,ava}=req.body
if(!title||!description||!category||!createdby)
    return next(new ErrorHandler('Please add all fields ',400) )
    const file=req.file
    const fileUri = getDataUri(file)
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)

     await Course.create({ 
        title,
        description,
        category,
        createdby,
        poster:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
     })
    res.status(201).json({
        success:true,
        message:"Course iscourse created successfully.You can add lectures now ",
        

    }) 
})

export const getCourseLectures = catchAsyncError(async (req,res,next)=>{
    const course = await Course.findById(req.params.id)
    if (!course) return  next(new ErrorHandler("Course not found"),404)
        course.views+=1
    await course.save()
    res.status(200).json({
        success:true,
        lectures:course.lectures

    })
})

export const addCourseLectures = catchAsyncError(async (req,res,next)=>{
    

    const {title,description}= req.body;
    const course = await Course.findById(req.params.id)
    if (!course) return  next(new ErrorHandler("Course not found"),404)

    const file=req.file

    const fileUri = getDataUri(file)
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resource_type:"video"
    })

    course.lectures.push({
        title,
        description,
        video:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    })
    course.numOfVideos=course.lectures.length;
    await course.save()

    res.status(200).json({
        success:true,
       message:"lectures added"

    })
})

export const deleteCourse = catchAsyncError(async (req,res,next)=>{
    const {id} = req.params

    const course = await Course.findById(id)
    if (!course) return  next(new ErrorHandler("Course not found",404))

        
for( let i=0 ;i<course.lectures.length;i++ )
    {
        var singleLecture = course.lectures[i];
        console.log(`Deleting video with public_id: ${singleLecture.video.public_id}`);
        await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
            resource_type: 'video'
        });
}
// if(singleLecture.video.length!==0)
//     return next(new ErrorHandler("vedios is not getting deleted"))
await cloudinary.v2.uploader.destroy(course.poster.public_id)

await course.deleteOne()




    
    
    res.status(201).json({
        success:true,
        message:"Course Deleted Successfully",
        

    }) 
})
  

export const deleteLecture = catchAsyncError(async (req,res,next)=>{
    const {courseid,lectureid} = req.query
    console.log("hello")

    const course = await Course.findById(courseid)
    if (!course) return  next(new ErrorHandler("Course not found",404))

        const lecture = await course.lectures.find((item)=>{
            if (item._id.toString()===lectureid.toString())
                return item
                    })
                    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
                        resource_type: 'video'
                    });

course.lectures= await course.lectures.filter((item)=>{
    if (item._id.toString()!==lectureid.toString())
        return item
            })
        
        course.numOfVideos=course.lectures.length;
        await course.save()




    
    
    res.status(201).json({
        success:true,
        message:"Lecture Deleted Successfully  ",
        

    }) 
})