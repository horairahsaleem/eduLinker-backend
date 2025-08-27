import { User } from '../Models/User.js';
import { catchAsyncError } from '../Middlewares/catchAsyncError.js';
import ErrorHandler from '../Utils/ErrorHandler.js';
import { config } from "dotenv";

config({ path: "./Config/config.env" });
// paymentController.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// import { stripe } from '../server.js';
import { Payment } from '../Models/Payment.js';

// Create a subscription for the user
// export const buySubscription = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.user._id);

//     if (user.role === "admin") {
//         return next(new ErrorHandler("Admin can't buy a subscription", 400));
//     }

//     // Check if user has a Stripe Customer ID, if not create one
//     if (!user.stripeCustomerId) {
//         const customer = await stripe.customers.create({
//             email: user.email,
//             name: user.name,
//         });
//         user.stripeCustomerId = customer.id;
//         await user.save();
//     }

//     const priceId = process.env.PRICE_ID || 'price_1QBSr8Kvc8GT7OiIkhb6pXUQ'; // Stripe Price ID

//     // Create a Checkout Session
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         customer: user.stripeCustomerId, // Ensure user has a Stripe Customer ID
//         line_items: [{
//             price: priceId,
//             quantity: 1,
//         }],
//         mode: 'subscription',
//         success_url: `${process.env.FRONTEND_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.FRONTEND_URL}/paymentfail`,
//     });

//     res.status(200).json({
//         success: true,
//         session_id: session.id, // Send session ID to frontend for redirection
//     });
// });
// *******
export const buySubscription = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return next(new ErrorHandler("Admin can't buy a subscription", 400));
    }

    // Check if user has a Stripe Customer ID, if not create one
    if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        user.stripeCustomerId = customer.id;
        await user.save();
    }

    const priceId = process.env.PRICE_ID || 'price_1QBSr8Kvc8GT7OiIkhb6pXUQ'; // Stripe Price ID

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer: user.stripeCustomerId, // Ensure user has a Stripe Customer ID
        line_items: [{
            price: priceId,
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/paymentfail`,
    });

    res.status(200).json({
        success: true,
        session_id: session.id,
        checkoutUrl: session.url, // Return full URL for redirection
    });
});

// Verify the payment for the subscription
export const paymentVerification = catchAsyncError(async (req, res, next) => {
    const { session_id } = req.body;

    // Check if session_id is provided
    if (!session_id) {
        return next(new ErrorHandler("Session ID is required", 400));
    }

    // Retrieve the Checkout Session from Stripe
    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(session_id);
        console.log("Stripe Session:", session); // Log the session for debugging
    } catch (err) {
        return next(new ErrorHandler("Invalid session ID or session retrieval failed", 400));
    }

    // Check if the session exists and payment status is 'paid'
    if (!session || session.payment_status !== 'paid') {
        return next(new ErrorHandler("Payment not completed or session is invalid", 400));
    }

    // Get the subscription ID from the session
    const subscriptionId = session.subscription;

    if (!subscriptionId) {
        return next(new ErrorHandler("Subscription ID is missing from the session", 500));
    }

    // Find the logged-in user by their ID
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update the user's subscription details
    user.subscription.id = subscriptionId;
    user.subscription.status = 'active';
    await user.save();

    // Create a payment record in the database
    const paymentRecord = {
        stripe_signature: session.id,
        stripe_subscription_id: subscriptionId,
        amount_paid: session.amount_total, // Store the total amount paid
        payment_status: session.payment_status, // Store the payment status
    };

    // Include stripe_payment_id only if it exists
    if (session.payment_intent) {
        paymentRecord.stripe_payment_id = session.payment_intent;
    }

    await Payment.create(paymentRecord);

    // Send a success response
    res.status(200).json({
        success: true,
        message: "Payment verification successful, subscription active",
        subscriptionId: subscriptionId,
    });
});


// Get the Stripe API Key (if necessary, for client-side)
export const getStripeKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.STRIPE_API_KEY,
    });
});

export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Check if the user has an active subscription
    if (!user.subscription?.id) {
        return next(new ErrorHandler("No active subscription found.", 404));
    }

    const subscriptionId = user.subscription.id

    // Log for debugging
    console.log('Attempting to cancel subscription with ID:', subscriptionId);

    // Cancel the subscription in Stripe
    // const subscriptionCancellation = await stripe.subscriptions.del(subscriptionId);
    const subscriptionCancellation = await stripe.subscriptions.cancel(subscriptionId);

    // Clear subscription information from user
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();

    // Respond to the client
    res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully.",
        subscriptionCancellation, // Optionally include the response from Stripe
    });
});
