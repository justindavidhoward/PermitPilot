import { Router, Response } from 'express';
import stripe, { PLANS } from '../stripe';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { query } from '../db';

const router = Router();

// Get available plans
router.get('/', (req, res) => {
  res.json({ plans: PLANS });
});

// Create a checkout session
router.post('/create-checkout-session', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const userId = req.user?.id;
    const userEmail = req.user?.email;

    // In a real app, we'd look up or create a Stripe Customer ID for this user
    // For now, we'll let Stripe create a new one or handle it via metadata
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // In production, this must be a real Stripe Price ID (e.g. price_123...)
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'http://localhost:3000'}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/settings`,
      customer_email: userEmail,
      metadata: {
        userId: userId || '',
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Get current subscription status
router.get('/subscriptions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const subscriptions = await query(`SELECT * FROM subscriptions WHERE user_id = '${userId}'`);
    
    if (!subscriptions || subscriptions.length === 0) {
      return res.json({ subscription: null });
    }
    
    res.json({ subscription: subscriptions[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

export default router;
