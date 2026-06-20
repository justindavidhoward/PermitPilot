import { Router, Request, Response } from 'express';
import stripe from '../stripe';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Stripe Webhook handler
// Note: This endpoint must receive raw body to verify signature
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // In Express, we usually need body-parser with verify to get raw body
    // If we're using express.json({ verify: ... }) it will be on req.body
    // For this environment, we'll assume req.body is the raw body if we configure it right
    // or we'll just try to parse it.
    
    // Actually, stripe.webhooks.constructEvent requires the raw body string/Buffer
    const payload = (req as any).rawBody || req.body;
    
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret || '');
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata.userId;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;
      
      // Update subscription in DB
      await handleSubscriptionChange(userId, stripeCustomerId, stripeSubscriptionId, 'active');
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      const stripeSubscriptionId = subscription.id;
      const status = subscription.status;
      
      // Find user by stripe subscription ID
      const results = await query(`SELECT user_id FROM subscriptions WHERE stripe_subscription_id = '${stripeSubscriptionId}'`);
      if (results && results.length > 0) {
        const userId = results[0].user_id;
        await query(`UPDATE subscriptions SET status = '${status}', updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = '${stripeSubscriptionId}'`);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const stripeSubscriptionId = subscription.id;
      
      await query(`UPDATE subscriptions SET status = 'canceled', updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = '${stripeSubscriptionId}'`);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSubscriptionChange(userId: string, customerId: string, subscriptionId: string, status: string) {
  // Check if subscription exists
  const existing = await query(`SELECT id FROM subscriptions WHERE user_id = '${userId}'`);
  
  if (existing && existing.length > 0) {
    await query(`UPDATE subscriptions SET 
      stripe_customer_id = '${customerId}', 
      stripe_subscription_id = '${subscriptionId}', 
      status = '${status}', 
      updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = '${userId}'`);
  } else {
    const id = uuidv4();
    await query(`INSERT INTO subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, status) 
      VALUES ('${id}', '${userId}', '${customerId}', '${subscriptionId}', '${status}')`);
  }
}

export default router;
