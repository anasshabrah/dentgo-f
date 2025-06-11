// pages/api/subscriptions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

console.log('📦 Using DATABASE_URL:', process.env.DATABASE_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const active = await prisma.subscription.findFirst({
        where: { userId: req.cookies.userId, status: 'active' },
      });
      return res.status(200).json(active || null);
    }

    if (req.method === 'POST') {
      const { priceId, paymentMethodId } = req.body;
      if (!priceId || !paymentMethodId) {
        return res
          .status(400)
          .json({ error: 'Both priceId and paymentMethodId are required' });
      }

      // Create or retrieve Stripe customer
      const customerRecord = await prisma.user.findUnique({
        where: { id: req.cookies.userId },
        select: { stripeCustomerId: true },
      });

      let stripeCustomerId = customerRecord?.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create();
        stripeCustomerId = customer.id;
        await prisma.user.update({
          where: { id: req.cookies.userId },
          data: { stripeCustomerId },
        });
      }

      // Create the subscription in Stripe
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
      });

      // Persist subscription record
      await prisma.subscription.create({
        data: {
          userId: req.cookies.userId,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
      });

      const clientSecret = (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent!.client_secret!;

      return res.status(201).json({
        clientSecret,
        subscriptionId: subscription.id,
        status: subscription.status,
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('❌ /api/subscriptions error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
