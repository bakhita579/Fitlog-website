import { WORKOUT_TYPES } from './config.js';

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  return Number(value);
};

export function validateWorkout(input, today = new Date().toLocaleDateString('en-CA')) {
  const errors = {};
  const exercise = String(input.exercise ?? '').trim();
  const notes = String(input.notes ?? '').trim();
  const duration = Number(input.duration);
  const sets = toNumberOrNull(input.sets);
  const reps = toNumberOrNull(input.reps);
  const weight = toNumberOrNull(input.weight);

  if (exercise.length < 2 || exercise.length > 50) {
    errors.exercise = 'Enter an exercise name between 2 and 50 characters.';
  }
  if (!WORKOUT_TYPES.includes(input.type)) {
    errors.type = 'Choose a workout type.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date ?? '')) {
    errors.date = 'Pick the date of the workout.';
  } else if (input.date > today) {
    errors.date = 'The date cannot be in the future.';
  }
  if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
    errors.duration = 'Duration must be a whole number from 1 to 600 minutes.';
  }
  if (sets !== null && (!Number.isInteger(sets) || sets < 1 || sets > 100)) {
    errors.sets = 'Sets must be a whole number from 1 to 100.';
  }
  if (reps !== null && (!Number.isInteger(reps) || reps < 1 || reps > 1000)) {
    errors.reps = 'Reps must be a whole number from 1 to 1000.';
  }
  if (weight !== null && (Number.isNaN(weight) || weight < 0 || weight > 1000)) {
    errors.weight = 'Weight must be between 0 and 1000 kg.';
  }
  if (notes.length > 400) {
    errors.notes = 'Notes can be up to 400 characters.';
  }

  const valid = Object.keys(errors).length === 0;
  const clean = {
    exercise,
    type: input.type,
    date: input.date,
    duration,
    sets,
    reps,
    weight,
    notes,
    favorite: Boolean(input.favorite),
  };
  return { valid, errors, clean };
}