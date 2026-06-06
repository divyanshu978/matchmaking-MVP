import { composeIntroduction, evaluateMatches } from './match-engine';
import { generateAiCopy } from './ai';
import type { Customer } from './types';

export type Suggestion = {
  customer: Customer;
  score: number;
  category: 'Excellent Match' | 'High Potential Match' | 'Good Match' | 'Low Compatibility';
  reasons: string[];
  aiExplanation: string;
  introduction: string;
};

export async function buildSuggestions(customer: Customer, candidates: Customer[], matchmakerName: string) {
  const baseMatches = evaluateMatches(customer, candidates);

  return Promise.all(
    baseMatches.map(async (match) => {
      const explanation = await generateAiCopy(
        `Write a short matchmaking compatibility explanation for ${customer.firstName} ${customer.lastName} and ${match.customer.firstName} ${match.customer.lastName}. Reason tags: ${match.reasons.join(', ') || 'broad compatibility'}. Score: ${match.score}/100.`,
        match.explanation
      );

      const introduction = await generateAiCopy(
        `Write a personalized introduction message from ${matchmakerName} introducing ${match.customer.firstName} ${match.customer.lastName} to ${customer.firstName} ${customer.lastName}. Mention profession, city, and shared values in 2 sentences.`,
        composeIntroduction(matchmakerName, customer, match.customer, explanation)
      );

      return {
        ...match,
        aiExplanation: explanation,
        introduction
      };
    })
  );
}