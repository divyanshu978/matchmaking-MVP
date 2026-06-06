import { randomUUID } from 'crypto';

import seedData from '@/data/seed-data.json';
import type { Customer, Match, Note, User } from './types';

type Store = {
  users: User[];
  customers: Customer[];
  notes: Note[];
  matches: Match[];
};

declare global {
  var matchmakingStore: Store | undefined;
}

const seedStore = structuredClone(seedData) as unknown as Omit<Store, 'notes' | 'matches'>;

const store: Store = globalThis.matchmakingStore ?? {
  ...seedStore,
  notes: [],
  matches: []
};

if (!globalThis.matchmakingStore) {
  globalThis.matchmakingStore = store;
}

export function getUsers() {
  return store.users;
}

export function getCustomers() {
  return store.customers;
}

export function getCustomerById(id: string) {
  return store.customers.find((customer) => customer.id === id) ?? null;
}

export function getNotesByCustomerId(customerId: string) {
  return store.notes
    .filter((note) => note.customerId === customerId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function addNote(customerId: string, note: string) {
  const createdNote: Note = {
    id: randomUUID(),
    customerId,
    note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.notes.unshift(createdNote);
  return createdNote;
}

export function updateNote(noteId: string, note: string) {
  const existing = store.notes.find((entry) => entry.id === noteId);

  if (!existing) {
    return null;
  }

  existing.note = note;
  existing.updatedAt = new Date().toISOString();
  return existing;
}

export function getMatchesByCustomerId(customerId: string) {
  return store.matches
    .filter((match) => match.customerId === customerId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function addMatch(match: Omit<Match, 'id' | 'createdAt'>) {
  const createdMatch: Match = {
    ...match,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  store.matches.unshift(createdMatch);
  return createdMatch;
}

export function updateMatch(id: string, patch: Partial<Match>) {
  const match = store.matches.find((entry) => entry.id === id);

  if (!match) {
    return null;
  }

  Object.assign(match, patch);
  return match;
}