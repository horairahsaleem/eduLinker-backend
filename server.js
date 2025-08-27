import app from "./App.js";
import { connectDB } from "./Config/database.js";
import cloudinary from "cloudinary"
import Stripe from 'stripe';

connectDB()
export const stripe = new Stripe(process.env.STRIPE_API_SECRET,{
    apiVersion: '2022-11-15', // Ensure a supported API version is specified
});


cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is Wroking on Port ${process.env.PORT}`)

})

