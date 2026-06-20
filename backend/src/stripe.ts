import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const isStripeEnabled = !!STRIPE_SECRET_KEY;

const stripe = isStripeEnabled
  ? new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: '2025-04-10' as any,
    })
  : null;

export const PLANS = [
  {
    id: 'price_1TkDEqRjAcfMQw7qh9NuBZ0m',
    name: 'Individual Monthly',
    price: 29,
    currency: 'usd',
    interval: 'month',
    url: 'https://buy.stripe.com/bJe00lduC9u225v9RddAk00'
  },
  {
    id: 'price_1TkDEqRjAcfMQw7qmc9haqhE',
    name: 'Contractor Monthly',
    price: 99,
    currency: 'usd',
    interval: 'month',
    url: 'https://buy.stripe.com/cNi6oJfCKfSqcK96F1dAk01'
  },
];

export default stripe;
