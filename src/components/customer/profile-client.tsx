"use client";

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Customer, Match, Note } from '@/lib/types';

type MatchSuggestion = {
  customer: Customer;
  score: number;
  category: 'Excellent Match' | 'High Potential Match' | 'Good Match' | 'Low Compatibility';
  reasons: string[];
  aiExplanation: string;
  introduction: string;
};

type ProfileClientProps = {
  customer: Customer;
  notes: Note[];
  matches: Match[];
  suggestions: MatchSuggestion[];
  matchmakerName: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function scoreTone(score: number) {
  if (score >= 90) return 'success';
  if (score >= 75) return 'warning';
  if (score >= 60) return 'default';
  return 'danger';
}

export function ProfileClient({ customer, notes, matches, suggestions, matchmakerName }: ProfileClientProps) {
  const [draftNote, setDraftNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [sentMatches, setSentMatches] = useState<string[]>(matches.map((match) => match.matchedProfileId));
  const [pending, startTransition] = useTransition();

  const sections = useMemo(
    () => [
      {
        label: 'Personal Information',
        items: [
          ['Full Name', `${customer.firstName} ${customer.lastName}`],
          ['Gender', customer.gender],
          ['Date of Birth', formatDate(customer.dateOfBirth)],
          ['Country', customer.country],
          ['City', customer.city],
          ['Height', customer.height],
          ['Languages', customer.languages.join(', ')]
        ]
      },
      {
        label: 'Education & Career',
        items: [
          ['College', customer.college],
          ['Degree', customer.degree],
          ['Company', customer.company],
          ['Designation', customer.designation],
          ['Income', customer.income]
        ]
      },
      {
        label: 'Family Information',
        items: [
          ['Marital Status', customer.maritalStatus],
          ['Siblings', String(customer.siblings)],
          ['Religion', customer.religion],
          ['Caste', customer.caste]
        ]
      },
      {
        label: 'Preferences',
        items: [
          ['Want Kids', customer.wantKids],
          ['Open to Relocate', customer.relocationPreference],
          ['Open to Pets', customer.openToPets],
          ['Mother Tongue', customer.motherTongue],
          ['Diet', customer.dietPreference],
          ['Smoking', customer.smoking],
          ['Drinking', customer.drinking],
          ['Family Type', customer.familyType],
          ['Astrology Preference', customer.astrologyPreference],
          ['Manglik Status', customer.manglikStatus],
          ['Partner Age Preference', customer.partnerAgePreference],
          ['Partner Height Preference', customer.partnerHeightPreference],
          ['Preferred Location', customer.preferredLocation]
        ]
      }
    ],
    [customer]
  );

  async function saveNote() {
    if (!draftNote.trim()) {
      toast.error('Add a note before saving');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/customers/${customer.id}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: draftNote })
        });

        if (!response.ok) {
          throw new Error('Could not add note');
        }

        setDraftNote('');
        toast.success('Note saved');
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not add note');
      }
    });
  }

  async function updateNote(noteId: string) {
    const note = noteDrafts[noteId];

    if (!note?.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note })
        });

        if (!response.ok) {
          throw new Error('Could not update note');
        }

        setEditingNoteId(null);
        toast.success('Note updated');
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not update note');
      }
    });
  }

  async function sendMatch(suggestion: MatchSuggestion) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: customer.id,
            matchedProfileId: suggestion.customer.id,
            score: suggestion.score,
            aiExplanation: suggestion.aiExplanation,
            introduction: suggestion.introduction
          })
        });

        if (!response.ok) {
          throw new Error('Could not send match');
        }

        const payload = await response.json();
        setSentMatches((current) => [...current, suggestion.customer.id]);
        toast.success(`Match sent. Email draft generated: ${payload.introduction.slice(0, 60)}...`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not send match');
      }
    });
  }

  return (
    <div className="space-y-4 pb-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>
                {customer.firstName} {customer.lastName}
              </CardTitle>
              <CardDescription>{customer.summary}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="outline">{customer.matchmakingStatus}</Badge>
              <Badge tone={customer.gender === 'Female' ? 'success' : 'default'}>{customer.gender}</Badge>
              <Badge tone="warning">{customer.age} years</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-2">
            {sections.map((section) => (
              <div key={section.label} className="rounded-2xl border border-slate-800 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.items.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="mt-1 text-sm text-slate-100">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Matchmaker Notes</CardTitle>
            <CardDescription>Track the history of conversations, follow-ups, and profile reactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} placeholder="Add a new note for this customer..." />
              <div className="flex justify-end">
                <Button onClick={saveNote} disabled={pending}>
                  Add note
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {notes.map((note) => {
                const isEditing = editingNoteId === note.id;
                return (
                  <div key={note.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <Textarea
                            value={noteDrafts[note.id] ?? note.note}
                            onChange={(event) => setNoteDrafts((current) => ({ ...current, [note.id]: event.target.value }))}
                          />
                        ) : (
                          <p className="text-sm text-slate-100">{note.note}</p>
                        )}
                        <p className="mt-2 text-xs text-slate-500">Updated {formatDate(note.updatedAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={() => updateNote(note.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(note.id)}>
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Matches</CardTitle>
            <CardDescription>Weighted compatibility scoring with AI explanations and introductions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => {
                const alreadySent = sentMatches.includes(suggestion.customer.id);
                return (
                  <div key={suggestion.customer.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-white">
                            {suggestion.customer.firstName} {suggestion.customer.lastName}
                          </p>
                          <Badge tone={scoreTone(suggestion.score)}>{suggestion.score}/100</Badge>
                          <Badge tone="outline">{suggestion.category}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {suggestion.customer.designation} · {suggestion.customer.city} · {suggestion.customer.languages.join(', ')}
                        </p>
                      </div>
                      <Button size="sm" disabled={alreadySent || pending} onClick={() => sendMatch(suggestion)}>
                        {alreadySent ? 'Sent' : 'Send Match'}
                      </Button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-200">{suggestion.aiExplanation}</p>

                    <div className="mt-3 rounded-xl bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Introduction preview</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">{suggestion.introduction}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestion.reasons.map((reason) => (
                        <Badge key={reason} tone="outline">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}

              {suggestions.length === 0 ? <p className="text-sm text-slate-400">No matches survived the hard filters for this profile.</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
          <CardDescription>Previously sent introductions for this customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {matches.map((match) => (
              <div key={match.id} className="rounded-2xl border border-slate-800 bg-white/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={match.status === 'sent' ? 'success' : 'outline'}>{match.status}</Badge>
                  <Badge tone="warning">{match.score}/100</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-200">{match.aiExplanation}</p>
                <p className="mt-3 text-xs text-slate-500">Sent {formatDate(match.createdAt)}</p>
              </div>
            ))}
            {matches.length === 0 ? <p className="text-sm text-slate-400">No matches have been sent yet.</p> : null}
          </div>
          <p className="mt-4 text-xs text-slate-500">Prepared by {matchmakerName}</p>
        </CardContent>
      </Card>
    </div>
  );
}