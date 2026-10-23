import { formatMinutes } from "./stats";
const $ = (selector) => document.querySelector(selector)
const FIELDS = ['exercise', 'type', 'date', 'duration', 'sets', 'reps', 'weight', 'notes']
export function setLoading(isLoading) {
    $('#loading').hidden = !isLoading;
  $('#workout-list').setAttribute('aria-busy', String(isLoading))
    
}
export function showMessage(text, kind = 'info') {
    const box = $ ('#message')
   box.textContent = text
  box.dataset.kind = kind
  box.hidden = !text
   
}
export function renderStats(summary) {
    $ ('#stat-total').textContent = summary.totalWorkouts
    $ ('stat-week').textContent = summary.weekWorkouts
    $ ('stat-time').textContent = formatMinutes (summary.totalMinutes)
    $ ('stat-top').textContent = summary.topType
    
}
function el(tag, { className, text, attrs = {} } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}
function actionButton(label, ariaLabel, onClick, className) {
  const btn = el('button', {
    text: label,
    className,
    attrs: { type: 'button', 'aria-label': ariaLabel },
  });
  btn.addEventListener('click', onClick);
  return btn;
}
export function renderWorkouts(workouts, { onEdit, onDelete, onFavorite }) {
  const list = $('#workout-list');
  list.replaceChildren();
  $('#empty').hidden = workouts.length > 0;

  workouts.forEach((w) => {
    const item = el('li', { className: 'workout', attrs: { 'data-type': w.type } });
    const main = el('div', { className: 'workout__main' });
    main.append(
      el('h3', { text: w.exercise }),
      el('p', { className: 'workout__meta', text: `${w.type} • ${w.date} • ${w.duration} min` })
    );
    if (w.sets && w.reps) {
      const load = w.weight ? ` @ ${w.weight} kg` : '';
      main.append(el('p', { text: `${w.sets} × ${w.reps}${load}` }));
    }
    if (w.notes) main.append(el('p', { className: 'workout__notes', text: w.notes }));

    const actions = el('div', { className: 'workout__actions' });
    const fav = actionButton(
      w.favorite ? '★ Saved' : '☆ Save',
      `Toggle favorite for ${w.exercise}`,
      () => onFavorite(w)
    );
    fav.setAttribute('aria-pressed', String(Boolean(w.favorite)));
    actions.append(
      fav,
      actionButton('Edit', `Edit ${w.exercise}`, () => onEdit(w)),
      actionButton('Delete', `Delete ${w.exercise}`, () => onDelete(w), 'danger')
    );

    item.append(main, actions);
    list.append(item);
  });
}
export function readForm() {
  const form = $('#workout-form');
  const data = Object.fromEntries(new FormData(form));
  data.favorite = form.elements.favorite.checked;
  return data;
}

export function fillForm(workout) {
  const form = $('#workout-form');
  FIELDS.forEach((name) => { form.elements[name].value = workout[name] ?? ''; });
  form.elements.favorite.checked = Boolean(workout.favorite);
}
export function resetForm() {
  $('#workout-form').reset();
  $('#form-title').textContent = 'Log a workout';
  $('#submit-btn').textContent = 'Save workout';
  $('#cancel-btn').hidden = true;
  showFieldErrors({});
}

export function enterEditMode() {
  $('#form-title').textContent = 'Edit workout';
  $('#submit-btn').textContent = 'Update workout';
  $('#cancel-btn').hidden = false;
  $('#form-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
export function showFieldErrors(errors) {
  const form = $('#workout-form');
  FIELDS.forEach((name) => {
    const message = errors[name] || '';
    $(`#error-${name}`).textContent = message;
    form.elements[name].setAttribute('aria-invalid', String(Boolean(message)));
  });
}
