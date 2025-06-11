// File: pages/api/cards.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Log DATABASE_URL once at cold start
console.log('📦 Using DATABASE_URL:', process.env.DATABASE_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Disable caching for all methods
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const cards = await prisma.card.findMany({
        where: { userId: req.cookies.userId || undefined },
      });
      return res.status(200).json(cards);
    }

    if (req.method === 'POST') {
      const { paymentMethodId, nickName } = req.body;
      if (!paymentMethodId) {
        return res.status(400).json({ error: 'paymentMethodId is required' });
      }

      const card = await prisma.card.create({
        data: {
          userId: req.cookies.userId,
          paymentMethodId,
          nickName: nickName || null,
        },
      });

      return res.status(201).json(card);
    }

    // unsupported
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('❌ /api/cards error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
