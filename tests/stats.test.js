import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize, isInLastSevenDays, formatMinutes } from '../js/stats.js';

const NOW = new Date('2026-10-20T12:00:00');
const data = [
  { type: 'Strength', date: '2026-10-19', duration: 45 },
  { type: 'Strength', date: '2026-10-15', duration: 60 },
  { type: 'Cardio', date: '2026-09-01', duration: 30 },
];

test('isInLastSevenDays handles edges', () => {
  assert.equal(isInLastSevenDays('2026-10-20', NOW), true);
  assert.equal(isInLastSevenDays('2026-10-14', NOW), true);
  assert.equal(isInLastSevenDays('2026-10-13', NOW), false);
  assert.equal(isInLastSevenDays('2026-10-21', NOW), false);
});

test('summarize totals, week count and top type', () => {
  const s = summarize(data, NOW);
  assert.equal(s.totalWorkouts, 3);
  assert.equal(s.totalMinutes, 135);
  assert.equal(s.weekWorkouts, 2);
  assert.equal(s.topType, 'Strength');
});

test('summarize handles an empty list', () => {
  const s = summarize([], NOW);
  assert.equal(s.totalWorkouts, 0);
  assert.equal(s.topType, '—');
});

test('formatMinutes', () => {
  assert.equal(formatMinutes(45), '45m');
  assert.equal(formatMinutes(135), '2h 15m');
});