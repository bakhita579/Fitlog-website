import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkout } from '../js/validation.js';

const TODAY = '2026-10-20';
const good = { exercise: 'Squat', type: 'Strength', date: '2026-10-19', duration: '45', sets: '4', reps: '8', weight: '80', notes: '' };

test('accepts a valid workout and converts numbers', () => {
  const { valid, clean } = validateWorkout(good, TODAY);
  assert.equal(valid, true);
  assert.equal(clean.duration, 45);
  assert.equal(clean.weight, 80);
});

test('optional fields become null when empty', () => {
  const { clean } = validateWorkout({ ...good, sets: '', reps: '', weight: '' }, TODAY);
  assert.deepEqual([clean.sets, clean.reps, clean.weight], [null, null, null]);
});

test('rejects a short exercise name', () => {
  assert.ok(validateWorkout({ ...good, exercise: ' a ' }, TODAY).errors.exercise);
});

test('rejects an unknown type', () => {
  assert.ok(validateWorkout({ ...good, type: 'Swim' }, TODAY).errors.type);
});

test('rejects missing and future dates', () => {
  assert.ok(validateWorkout({ ...good, date: '' }, TODAY).errors.date);
  assert.ok(validateWorkout({ ...good, date: '2026-12-01' }, TODAY).errors.date);
});

test('rejects bad duration, sets, reps, weight and long notes', () => {
  const { errors } = validateWorkout(
    { ...good, duration: '0', sets: '1.5', reps: '5000', weight: '-3', notes: 'x'.repeat(401) },
    TODAY
  );
  assert.deepEqual(Object.keys(errors).sort(), ['duration', 'notes', 'reps', 'sets', 'weight']);
});