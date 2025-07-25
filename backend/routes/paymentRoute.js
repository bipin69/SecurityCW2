import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", paymentController.createCheckoutSession);
router.post("/webhook", paymentController.stripeWebhook);

export default router; 