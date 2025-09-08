import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { contact, courseRequest, getDashboardStats } from "../Controllers/otherController.js";


const  router = express.Router()
router.route('/contact').post(isAuthenticated,contact)
router.route('/courserequest').post(isAuthenticated,courseRequest)
router.route('/admin/getDashboardStats').post(isAuthenticated,getDashboardStats)




export default router; 