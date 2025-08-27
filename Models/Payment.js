import mongoose from "mongoose";

const schema = new mongoose.Schema({
    stripe_signature: {
        type: String,
        required: true,
    },
    stripe_payment_id: {
        type: String, // Make this optional for subscription payments
        required: false,
    },
    stripe_subscription_id: {
        type: String,
        required: true,
    },
    amount_paid: {
        type: Number,
        required: true,
    },
    payment_status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Payment = mongoose.model("Payment", schema);
