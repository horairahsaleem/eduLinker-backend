import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { contact, courseRequest } from "../Controllers/otherController.js";


const  router = express.Router()
router.route('/contact').post(isAuthenticated,contact)
router.route('/courserequest').post(isAuthenticated,courseRequest)




export default router; 