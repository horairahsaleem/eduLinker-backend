import express from "express";
import { addCourseLectures, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from "../Controllers/courseController.js";
import singleUpload from "../Middlewares/multer.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth.js";

const router = express.Router();

router.route('/courses').get(getAllCourses)
router.route('/createcourse').post(isAuthenticated,isAuthorized,singleUpload,createCourse)
router.route('/course/:id').get(getCourseLectures).post(isAuthenticated,isAuthorized,singleUpload,addCourseLectures)
.delete(isAuthenticated,isAuthorized,deleteCourse)
router.route('/lecture').delete(isAuthenticated,isAuthorized,deleteLecture)


export default router; 