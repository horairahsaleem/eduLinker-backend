import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import {alreadySubscribed} from "../Middlewares/alreadySubscribed.js"
import { buySubscription, cancelSubscription, getStripeKey, paymentVerification } from "../Controllers/paymentController.js";


const router = express.Router();

// buy subcription 
router.route('/subscribe').get(isAuthenticated,alreadySubscribed,buySubscription)
router.route('/paymentverification').post(isAuthenticated,paymentVerification)
router.route('/getstripekey').get(isAuthenticated,getStripeKey)
router.route('/subscribe/cancel').delete(isAuthenticated,cancelSubscription)







export default router;