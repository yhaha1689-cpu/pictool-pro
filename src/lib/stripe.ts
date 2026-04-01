import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// 价格ID配置
export const PRICE_IDS = {
  pro: 'price_1THIOv4CYkeHQCTnxpX6BZE8',
  enterprise: 'price_1THIPQ4CYkeHQCTnNj4XSmbT',
};