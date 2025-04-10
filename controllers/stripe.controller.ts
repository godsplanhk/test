import type { Request, Response } from "express"
import Stripe from "stripe"
import dotenv from 'dotenv'

dotenv.config()
// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil", // Specify the Stripe API version
})

// Map our plan IDs to Stripe price IDs
const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  max: process.env.STRIPE_MAX_PRICE_ID,
}

// Extended types for Stripe responses with expanded fields
interface ExpandedInvoice extends Stripe.Invoice {
  payment_intent?: Stripe.PaymentIntent | string
}

interface ExpandedSubscription extends Stripe.Subscription {
  latest_invoice: ExpandedInvoice | string | null
}

/**
 * Create a payment intent for one-time payments
 */
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId, amount, userId } = req.body

    // For subscription plans, we should use createSubscription instead
    if (planId && PLAN_PRICE_MAP[planId]) {
      res.status(400).json({
        error: "For subscription plans, use the create-subscription endpoint",
      })
      return
    }

    if (!amount) {
      res.status(400).json({ error: "Amount is required" })
      return
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId: planId || "",
        userId: userId,
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error creating payment intent:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Create a subscription
 */
export const createSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { planId, customerId, paymentMethodId, email, userId } = req.body

    // Validate plan ID
    if (!planId || !PLAN_PRICE_MAP[planId]) {
      res.status(400).json({ error: "Invalid plan ID" })
      return
    }

    // Validate payment method ID
    if (!paymentMethodId) {
      res.status(400).json({ error: "Payment method ID is required" })
      return
    }

    let customer: Stripe.Customer

    // If no customer ID is provided, create a new customer
    if (!customerId) {
      if (!email) {
        res.status(400).json({ error: "Email is required when creating a new customer" })
        return
      }

      customer = (await stripe.customers.create({
        payment_method: paymentMethodId,
        email: email,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
        metadata: {
          userId: userId,
        },
      })) as Stripe.Customer
    } else {
      // Use existing customer
      customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer

      if (customer.deleted) {
        res.status(400).json({ error: "Customer has been deleted" })
        return
      }

      // Attach the payment method to the customer if provided
      if (paymentMethodId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        })

        // Set as default payment method
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        })
      }
    }

    // Create the subscription
    const subscription = (await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: PLAN_PRICE_MAP[planId] as string }],
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: userId,
      },
    })) as ExpandedSubscription

    // Prepare the response
    const response = {
      subscriptionId: subscription.id,
      customerId: customer.id,
      status: subscription.status,
    } as any

    // Check if latest_invoice exists and has a payment_intent
    if (subscription.latest_invoice && typeof subscription.latest_invoice !== "string") {
      const invoice = subscription.latest_invoice as ExpandedInvoice

      // Check if payment_intent exists and is expanded
      if (invoice.payment_intent && typeof invoice.payment_intent !== "string") {
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

        // Add client secret to response if available
        if (paymentIntent.client_secret) {
          response.clientSecret = paymentIntent.client_secret
        }
      }
    }

    res.status(200).json(response)
  } catch (error) {
    const err = error as Error
    console.error("Error creating subscription:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get subscription details
 */
export const getSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ error: "Subscription ID is required" })
      return
    }

    const subscription = await stripe.subscriptions.retrieve(id)

    res.status(200).json({
      subscription,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error retrieving subscription:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = req.body

    if (!subscriptionId) {
      res.status(400).json({ error: "Subscription ID is required" })
      return
    }

    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId)

    res.status(200).json({
      status: canceledSubscription.status,
      canceledAt: canceledSubscription.canceled_at,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error canceling subscription:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Handle Stripe webhooks
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!endpointSecret) {
    res.status(500).json({ error: "Webhook secret is not configured" })
    return
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    const error = err as Error
    console.error(`Webhook Error: ${error.message}`)
    res.status(400).send(`Webhook Error: ${error.message}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice
      // Handle successful payment
      console.log("Payment succeeded for invoice:", invoice.id)
      // You could update your database here
      break
    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription
      console.log("Subscription created:", subscription.id)
      // You could update your database here
      break
    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.log("Subscription updated:", updatedSubscription.id)
      // You could update your database here
      break
    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log("Subscription canceled:", deletedSubscription.id)
      // You could update your database here
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true })
}

/**
 * Get all subscriptions for a customer
 */
export const getCustomerSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.query

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" })
      return
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId as string,
      status: "all",
      expand: ["data.default_payment_method"],
    })

    res.status(200).json({
      subscriptions: subscriptions.data,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error retrieving customer subscriptions:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Update a subscription (change plan, etc.)
 */
export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { planId, paymentMethodId } = req.body

    if (!id) {
      res.status(400).json({ error: "Subscription ID is required" })
      return
    }

    // Get the current subscription
    const currentSubscription = await stripe.subscriptions.retrieve(id)

    // Prepare update parameters
    const updateParams: Stripe.SubscriptionUpdateParams = {}

    // Update payment method if provided
    if (paymentMethodId) {
      updateParams.default_payment_method = paymentMethodId
    }

    // Update plan if provided
    if (planId && PLAN_PRICE_MAP[planId]) {
      // Get the current subscription item ID
      const itemId = currentSubscription.items.data[0].id

      updateParams.items = [
        {
          id: itemId,
          price: PLAN_PRICE_MAP[planId] as string,
        },
      ]
    }

    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(id, updateParams)

    res.status(200).json({
      subscription: updatedSubscription,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error updating subscription:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Create a setup intent for saving payment methods
 */
export const createSetupIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.body

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" })
      return
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    })

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error creating setup intent:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Get all payment methods for a customer
 */
export const getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.query

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" })
      return
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId as string,
      type: "card",
    })

    res.status(200).json({
      paymentMethods: paymentMethods.data,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error retrieving payment methods:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Set default payment method for a customer
 */
export const setDefaultPaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, paymentMethodId } = req.body

    if (!customerId || !paymentMethodId) {
      res.status(400).json({ error: "Customer ID and Payment Method ID are required" })
      return
    }

    // Update the customer's default payment method
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    res.status(200).json({
      customer,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error setting default payment method:", err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Remove a payment method
 */
export const removePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ error: "Payment Method ID is required" })
      return
    }

    // Detach the payment method
    const paymentMethod = await stripe.paymentMethods.detach(id)

    res.status(200).json({
      paymentMethod,
    })
  } catch (error) {
    const err = error as Error
    console.error("Error removing payment method:", err)
    res.status(500).json({ error: err.message })
  }
}

