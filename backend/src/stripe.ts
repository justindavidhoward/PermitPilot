import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-10' as any, // Use the latest or a stable version
});

export const PLANS = [
  {
    id: 'price_1TkDEqRjAcfMQw7qh9NuBZ0m',
    name: 'Individual Monthly',
    price: 29,
    currency: 'usd',
    interval: 'month',
  },
  {
    id: 'price_1TkDEqRjAcfMQw7qmc9haqhE',
    name: 'Contractor Monthly',
    price: 99,
    currency: 'usd',
    interval: 'month',
  },
];

export default stripe;
