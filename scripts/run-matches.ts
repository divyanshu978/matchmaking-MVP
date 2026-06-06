import seedData from '../src/data/seed-data.json';
import { evaluateMatches } from '../src/lib/match-engine';
import type { Customer } from '../src/lib/types';

async function main() {
  const customers = seedData.customers as unknown as Customer[];
  if (!customers || customers.length === 0) {
    console.error('No customers found in seed-data.json');
    process.exit(1);
  }

  const count = Math.min(5, customers.length);
  for (let idx = 0; idx < count; idx++) {
    const subject = customers[idx];
    console.log(`Subject: ${subject.firstName} ${subject.lastName} (id=${subject.id})\n`);

    const matches = evaluateMatches(subject, customers);

    if (matches.length === 0) {
      console.log('  No matches found.\n');
      continue;
    }

    console.log('  Top matches:');
    matches.forEach((m, i) => {
      console.log(`\n  ${i + 1}. ${m.customer.firstName} ${m.customer.lastName} (id=${m.customer.id})`);
      console.log(`     Score: ${m.score}  Category: ${m.category}`);
      console.log(`     Reasons: ${m.reasons.join(', ') || 'none'}`);
      console.log(`     Summary: ${m.explanation}`);
    });

    console.log('\n-----------------------------\n');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
