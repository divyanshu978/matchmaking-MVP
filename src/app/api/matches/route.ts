import { NextResponse } from 'next/server';

import { composeIntroduction } from '@/lib/match-engine';
import { generateAiCopy } from '@/lib/ai';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';
import { addMatch, getCustomerById } from '@/lib/store';

export async function POST(request: Request) {
  const session = await getAuthenticatedUserFromCookies();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    customerId?: string;
    matchedProfileId?: string;
    score?: number;
    aiExplanation?: string;
    introduction?: string;
  };

  if (!body.customerId || !body.matchedProfileId) {
    return NextResponse.json({ error: 'customerId and matchedProfileId are required' }, { status: 400 });
  }

  const customer = getCustomerById(body.customerId);
  const candidate = getCustomerById(body.matchedProfileId);

  if (!customer || !candidate) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const aiExplanation = await generateAiCopy(
    `Create a concise matchmaking explanation for ${customer.firstName} ${customer.lastName} and ${candidate.firstName} ${candidate.lastName}. Mention profession, family values, and lifestyle alignment in one paragraph.`,
    body.aiExplanation ?? 'Strong compatibility across core preferences and lifestyle.'
  );

  const introduction = await generateAiCopy(
    `Write a personalized introduction message from ${session.name} introducing ${candidate.firstName} ${candidate.lastName} to ${customer.firstName} ${customer.lastName}. Mention city, profession, and why the introduction is relevant.`,
    body.introduction ?? composeIntroduction(session.name, customer, candidate, aiExplanation)
  );

  const match = addMatch({
    customerId: customer.id,
    matchedProfileId: candidate.id,
    score: body.score ?? 0,
    aiExplanation,
    introduction,
    status: 'sent'
  });

  return NextResponse.json({ match, introduction });
}