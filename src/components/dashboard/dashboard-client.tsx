"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Customer } from '@/lib/types';

type DashboardClientProps = {
  customers: Customer[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

function parseIncome(value: string | number) {
  const source = typeof value === 'number' ? String(value) : value;
  const parsed = Number.parseFloat(source.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function DashboardClient({ customers }: DashboardClientProps) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'age' | 'income' | 'name'>('recent');

  const cities = useMemo(() => Array.from(new Set(customers.map((customer) => customer.city))).sort(), [customers]);
  const statuses = useMemo(() => Array.from(new Set(customers.map((customer) => customer.matchmakingStatus))).sort(), [customers]);

  const filtered = useMemo(() => {
    const lowerQuery = query.toLowerCase();

    const entries = customers.filter((customer) => {
      const matchesQuery =
        lowerQuery.length === 0 ||
        [customer.firstName, customer.lastName, customer.city, customer.religion, customer.caste, customer.company, customer.designation]
          .join(' ')
          .toLowerCase()
          .includes(lowerQuery);

      const matchesCity = city === 'all' || customer.city === city;
      const matchesStatus = status === 'all' || customer.matchmakingStatus === status;

      return matchesQuery && matchesCity && matchesStatus;
    });

    const sorted = [...entries].sort((left, right) => {
      if (sortBy === 'age') return right.age - left.age;
      if (sortBy === 'income') return parseIncome(right.income) - parseIncome(left.income);
      if (sortBy === 'name') return `${left.firstName} ${left.lastName}`.localeCompare(`${right.firstName} ${right.lastName}`);
      return right.dateOfBirth.localeCompare(left.dateOfBirth);
    });

    return sorted;
  }, [city, customers, query, sortBy, status]);

  const stats = [
    { label: 'Assigned customers', value: customers.length.toString() },
    { label: 'Filtered results', value: filtered.length.toString() },
    { label: 'Cities covered', value: new Set(customers.map((customer) => customer.city)).size.toString() },
    {
      label: 'Avg. income',
      value: `₹${formatCurrency(Math.round(customers.reduce((sum, customer) => sum + parseIncome(customer.income), 0) / customers.length))}`
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-950/80">
            <CardContent className="px-5 py-5">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Pipeline</CardTitle>
          <CardDescription>Search, filter, and sort all assigned profiles from a CRM-style dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, city, religion, company" />
            <select className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="all">All cities</option>
              {cities.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
            <select className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              {statuses.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
            <select className="h-11 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
              <option value="recent">Most recent</option>
              <option value="age">Age</option>
              <option value="income">Income</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filtered.map((customer) => (
              <article key={customer.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 transition-transform hover:-translate-y-0.5 hover:border-rose-400/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <Badge tone={customer.gender === 'Female' ? 'success' : 'default'}>{customer.gender}</Badge>
                      <Badge tone="outline">{customer.matchmakingStatus}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {customer.age} years old · {customer.city}, {customer.country} · {customer.religion} · {customer.caste}
                    </p>
                  </div>
                  <Badge tone="warning">{customer.income}</Badge>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Career</p>
                    <p className="mt-1 text-sm text-slate-200">
                      {customer.designation} at {customer.company}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Preferences</p>
                    <p className="mt-1 text-sm text-slate-200">
                      Kids: {customer.childrenPreference} · Relocate: {customer.relocationPreference}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-slate-300">{customer.summary}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-500 px-3 text-sm font-medium text-white transition-colors hover:bg-rose-400"
                  >
                    Open profile
                  </Link>
                  <Badge tone="outline">{customer.languages.join(' · ')}</Badge>
                  <Badge tone="outline">{customer.motherTongue}</Badge>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}