import express  from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./Middlewares/Error.js";
import cookieParser from "cookie-parser";
config({
    path:'./Config/config.env'
})


import course from './Routes/courseRoutes.js'
import user from './Routes/userRoutes.js'
import payment from './Routes/paymentsRoutes.js'

const app = express();
// using middlewares 
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
)




app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);

app.use(ErrorMiddleware)

export default app;
