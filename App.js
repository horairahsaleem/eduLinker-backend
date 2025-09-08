import express  from "express";
import { config as dotenvConfig } from "dotenv";
import ErrorMiddleware from "./Middlewares/Error.js";
import cookieParser from "cookie-parser";
import  cors from 'cors'
dotenvConfig({ path: "./Config/config.env" });


import course from './Routes/courseRoutes.js'
import user from './Routes/userRoutes.js'
import payment from './Routes/paymentsRoutes.js'
import other from './Routes/other.js'

const app = express();
// using middlewares 
app.use(
  cors({
    origin: ["http://localhost:3000", "https://effortless-swan-b08432.netlify.app"],
    credentials: true,
  })
);
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
app.use("/api/v1", other);

//   Health check of a backend
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});    


app.use(ErrorMiddleware)

export default app;
