import type { Customer } from './types';

type MatchResult = {
  customer: Customer;
  score: number;
  category: 'Excellent Match' | 'High Potential Match' | 'Good Match' | 'Low Compatibility';
  reasons: string[];
  explanation: string;
};

const scoreCategory = (score: number): MatchResult['category'] => {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'High Potential Match';
  if (score >= 60) return 'Good Match';
  return 'Low Compatibility';
};

const parseAgeRange = (value: string) => {
  const [min, max] = value.split('-').map((entry) => Number.parseInt(entry, 10));
  return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 99 };
};

const parseHeight = (value: string) => Number.parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

const parseIncome = (value: string | number) => {
  const source = typeof value === 'number' ? String(value) : value;
  return Number.parseFloat(source.replace(/[^0-9.]/g, '')) || 0;
};

const sharedPreference = (left: string, right: string) => left === right;

const sharedLanguage = (left: string[], right: string[]) => left.some((entry) => right.includes(entry));

const sharedLifestyle = (left: Customer, right: Customer) => [left.dietPreference === right.dietPreference, left.openToPets === right.openToPets, left.smoking === right.smoking, left.drinking === right.drinking].filter(Boolean).length;

function hardFilter(customer: Customer, candidate: Customer) {
  if (customer.gender === candidate.gender) return false;

  const ageRange = parseAgeRange(customer.partnerAgePreference);
  if (candidate.age < ageRange.min || candidate.age > ageRange.max) return false;

  const preferredHeight = parseHeight(customer.partnerHeightPreference);
  const candidateHeight = parseHeight(candidate.height);
  if (preferredHeight && candidateHeight && Math.abs(candidateHeight - preferredHeight) > 20) return false;

  const preferredLocation = customer.preferredLocation.toLowerCase();
  if (preferredLocation && candidate.city.toLowerCase() !== preferredLocation && candidate.country !== 'India') return false;

  if (!sharedPreference(customer.childrenPreference, candidate.childrenPreference) && customer.childrenPreference !== 'Open' && candidate.childrenPreference !== 'Open') return false;
  if (!sharedPreference(customer.relocationPreference, candidate.relocationPreference) && customer.relocationPreference !== 'Open' && candidate.relocationPreference !== 'Open') return false;

  return true;
}

function buildExplanation(customer: Customer, candidate: Customer, score: number, category: MatchResult['category'], reasons: string[]) {
  const reasonText = reasons.length > 0 ? reasons.slice(0, 3).join(', ').toLowerCase() : 'broad compatibility across core preferences';
  return `${category} (${score}/100). ${customer.firstName} and ${candidate.firstName} align on ${reasonText}. Their profiles suggest a realistic introduction with strong potential for a warm first conversation.`;
}

export function evaluateMatches(customer: Customer, candidates: Customer[]): MatchResult[] {
  return candidates
    .filter((candidate) => candidate.id !== customer.id)
    .filter((candidate) => hardFilter(customer, candidate))
    .map((candidate) => {
      const reasons: string[] = [];
      let score = 0;

      if (customer.gender === 'Male') {
        const ageScore = Math.max(0, 20 - Math.min(20, candidate.age - customer.age + 3) * 2);
        const heightScore = Math.max(0, 15 - Math.abs(parseHeight(customer.height) - parseHeight(candidate.height)) / 2);
        const incomeScore = parseIncome(candidate.income) <= parseIncome(customer.income) ? 15 : Math.max(0, 15 - Math.round((parseIncome(candidate.income) - parseIncome(customer.income)) / 250000));
        const religionScore = customer.religion === candidate.religion ? 12 : 0;
        const casteScore = customer.caste === candidate.caste ? 8 : 0;
        const maritalScore = candidate.maritalStatus === 'Never Married' ? 8 : candidate.maritalStatus === 'Divorced' ? 4 : 0;
        const childrenScore = sharedPreference(customer.childrenPreference, candidate.childrenPreference) || customer.childrenPreference === 'Open' || candidate.childrenPreference === 'Open' ? 30 : 0;
        const relocationScore = sharedPreference(customer.relocationPreference, candidate.relocationPreference) || customer.relocationPreference === 'Open' || candidate.relocationPreference === 'Open' ? 10 : 0;
        const languageScore = sharedLanguage(customer.languages, candidate.languages) ? 10 : 0;

        score = Math.round(ageScore + heightScore + incomeScore + religionScore + casteScore + maritalScore + childrenScore + relocationScore + languageScore);

        if (maritalScore >= 8) reasons.push('marital status fit');
        if (religionScore) reasons.push('religion match');
        if (casteScore) reasons.push('caste match');
        if (childrenScore) reasons.push('aligned children preference');
        if (ageScore >= 12) reasons.push('age compatibility');
        if (heightScore >= 10) reasons.push('height compatibility');
        if (incomeScore >= 10) reasons.push('income alignment');
        if (relocationScore) reasons.push('relocation fit');
        if (languageScore) reasons.push('language match');
      } else {
        const professionScore = candidate.designation === customer.designation || candidate.company === customer.company ? 20 : 12;
        const educationScore = candidate.degree === customer.degree || candidate.college === customer.college ? 20 : 10;
        const religionScore = customer.religion === candidate.religion ? 12 : 0;
        const casteScore = customer.caste === candidate.caste ? 8 : 0;
        const maritalScore = candidate.maritalStatus === 'Never Married' ? 8 : candidate.maritalStatus === 'Divorced' ? 4 : 0;
        const relocationScore = sharedPreference(customer.relocationPreference, candidate.relocationPreference) || customer.relocationPreference === 'Open' || candidate.relocationPreference === 'Open' ? 20 : 8;
        const childrenScore = sharedPreference(customer.childrenPreference, candidate.childrenPreference) || customer.childrenPreference === 'Open' || candidate.childrenPreference === 'Open' ? 20 : 0;
        const languageScore = sharedLanguage(customer.languages, candidate.languages) ? 10 : 0;
        const lifestyleScore = Math.round((sharedLifestyle(customer, candidate) / 4) * 10);

        score = Math.min(100, professionScore + educationScore + religionScore + casteScore + maritalScore + relocationScore + childrenScore + languageScore + lifestyleScore);

        if (maritalScore >= 8) reasons.push('marital status fit');
        if (religionScore) reasons.push('religion match');
        if (casteScore) reasons.push('caste match');
        if (professionScore >= 15) reasons.push('career compatibility');
        if (educationScore >= 15) reasons.push('education compatibility');
        if (relocationScore) reasons.push('relocation compatibility');
        if (childrenScore) reasons.push('shared children preference');
        if (languageScore) reasons.push('language match');
        if (lifestyleScore >= 7) reasons.push('lifestyle match');
      }

      const category = scoreCategory(score);

      return {
        customer: candidate,
        score,
        category,
        reasons,
        explanation: buildExplanation(customer, candidate, score, category, reasons)
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
}

export function composeIntroduction(matchmaker: string, customer: Customer, candidate: Customer, explanation: string) {
  return `Hi ${customer.firstName}, we would like to introduce ${candidate.firstName} ${candidate.lastName}, a ${candidate.designation} from ${candidate.city} who shares a strong profile fit with your preferences. ${explanation} Regards, ${matchmaker}.`;
}