import { Router } from "express"
import { raw } from "express"
import {
  createPaymentIntent,
  createSubscription,
  getSubscription,
  cancelSubscription,
  handleWebhook,
  getCustomerSubscriptions,
  updateSubscription,
  createSetupIntent,
  getPaymentMethods,
  setDefaultPaymentMethod,
  removePaymentMethod,
} from "../controllers/stripe.controller"

const router = Router()

// Payment routes
router.post("/create-payment-intent", createPaymentIntent)
router.post("/create-subscription", createSubscription)
router.get("/subscription/:id", getSubscription)
router.post("/cancel-subscription", cancelSubscription)

// Webhook route - needs raw body for signature verification
router.post("/webhook", raw({ type: "application/json" }), handleWebhook)

// Customer subscription management
router.get("/customer-subscriptions", getCustomerSubscriptions)
router.put("/subscription/:id", updateSubscription)

// Payment method management
router.post("/create-setup-intent", createSetupIntent)
router.get("/payment-methods", getPaymentMethods)
router.post("/set-default-payment-method", setDefaultPaymentMethod)
router.delete("/payment-method/:id", removePaymentMethod)

export default router

