const ErrorMiddleware =(err,req,res,next)=>{
   err.statusCode = err.statusCode||500;
    err.message=err.message||"Internl server error"


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        statusCode:err.statusCode,

    })

}   


export default ErrorMiddleware