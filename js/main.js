import * as api from './api';
import { validateWorkout } from './validation';
import { summarize } from './stats';
import * as ui from './ui';

let editingId = null;
const filters = { type: '', q: '' };

async function loadWorkouts() {
  ui.setLoading(true);
  try {
    const visible = await api.getWorkouts(filters);
    ui.renderWorkouts(visible, handlers);
    const everything = filters.type || filters.q
      ? await api.getWorkouts()
      : visible;
    ui.renderStats(summarize(everything));
  } catch (error) {
    ui.showMessage(error.message, 'error');
  } finally {
    ui.setLoading(false);
  }
}

const handlers = {
  onEdit(workout) {
    editingId = workout.id;
    ui.fillForm(workout);
    ui.enterEditMode();
  },
  async onDelete(workout) {
    if (!window.confirm(`Delete "${workout.exercise}"? This cannot be undone.`)) return;
    try {
      await api.deleteWorkout(workout.id);
      await loadWorkouts();
      ui.showMessage('Workout deleted.', 'success');
    } catch (error) {
      ui.showMessage(error.message, 'error');
    }
  },
  async onFavorite(workout) {
    try {
      await api.patchWorkout(workout.id, { favorite: !workout.favorite });
      await loadWorkouts();
    } catch (error) {
      ui.showMessage(error.message, 'error');
    }
  },
};

async function handleSubmit(event) {
  event.preventDefault();
  const { valid, errors, clean } = validateWorkout(ui.readForm());
  ui.showFieldErrors(errors);
  if (!valid) {
    ui.showMessage('Fix the highlighted fields and try again.', 'error');
    return;
  }

  try {
    const wasEditing = Boolean(editingId);
    if (wasEditing) await api.replaceWorkout(editingId, clean);
    else await api.createWorkout(clean);
    editingId = null;
    ui.resetForm();
    await loadWorkouts();
    ui.showMessage(wasEditing ? 'workout updated' : 'workout saved', 'success');
  } catch (error) {
    ui.showMessage(error.message, 'error');
  }
}

function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function init() {
  const form = document.querySelector('#workout-form');
  form.elements.date.max = new Date().toLocaleDateString('en-CA');
  form.addEventListener('submit', handleSubmit);

  document.querySelector('#cancel-btn').addEventListener('click', () => {
    editingId = null;
    ui.resetForm();
  });

  document.querySelector('#filter-type').addEventListener('change', (e) => {
    filters.type = e.target.value;
    loadWorkouts();
  });

  document.querySelector('#search').addEventListener(
    'input',
    debounce((e) => {
      filters.q = e.target.value.trim();
      loadWorkouts();
    })
  );

  loadWorkouts();
}

init();
