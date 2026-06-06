export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Separated';
export type Preference = 'Yes' | 'No' | 'Open';

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  age: number;
  country: string;
  city: string;
  height: string;
  languages: string[];
  email: string;
  phoneNumber: string;
  college: string;
  degree: string;
  company: string;
  designation: string;
  income: number;
  maritalStatus: MaritalStatus;
  siblings: number;
  religion: string;
  caste: string;
  childrenPreference: Preference;
  relocationPreference: Preference;
  wantKids: Preference;
  openToPets: Preference;
  motherTongue: string;
  dietPreference: string;
  smoking: Preference;
  drinking: Preference;
  familyType: string;
  hobbies: string[];
  astrologyPreference: string;
  manglikStatus: string;
  partnerAgePreference: string;
  partnerHeightPreference: string;
  preferredLocation: string;
  matchmakingStatus: string;
  summary: string;
};

export type Note = {
  id: string;
  customerId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type MatchStatus = 'suggested' | 'sent' | 'dismissed';

export type Match = {
  id: string;
  customerId: string;
  matchedProfileId: string;
  score: number;
  aiExplanation: string;
  introduction: string;
  status: MatchStatus;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'matchmaker';
};

export type SeedData = {
  users: User[];
  customers: Customer[];
  notes: Note[];
  matches: Match[];
};