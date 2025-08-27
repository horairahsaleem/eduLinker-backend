import express from "express";
import { addToPlayList, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, Login, Logout, register, removeFromPlayList, resetPassword, updateProfile, updateProfilePicture, updateUserRole } from "../Controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/auth.js";
import singleUpload from "../Middlewares/multer.js";

const router = express.Router();
router.route('/register').post(singleUpload,register)
router.route('/login').post(Login)
router.route('/logout').get(Logout)
router.route('/me').get(isAuthenticated, getMyProfile).delete(isAuthenticated,deleteMyProfile)
router.route('/changepassword').put(isAuthenticated, changePassword)
router.route('/updateprofile').put(isAuthenticated , updateProfile)
router.route('/updateprofilepicture').put(isAuthenticated ,singleUpload, updateProfilePicture)
router.route('/forgetpassword').post(forgetPassword)
router.route('/resetpassword/:token').put(resetPassword)
router.route('/addtoplaylist').post(isAuthenticated,addToPlayList)
router.route('/removefromplaylist').post(isAuthenticated,removeFromPlayList)
// Admin routes
router.route('/admin/users').get(isAuthenticated,isAuthorized,getAllUsers)
router.route('/admin/users/:id').put(isAuthenticated,isAuthorized,updateUserRole)
.delete(isAuthenticated,isAuthorized,deleteUser)




export default router;