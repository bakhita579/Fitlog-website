import { API_URL } from './config.js';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}, baseUrl = API_URL) {
  let response;
  try {
    response = await fetch(`${baseUrl}/${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new ApiError(`The server returned an error (${response.status}).`, response.status);
  }

  return response.json();
}

export function getWorkouts({ type = '', q = '' } = {}, baseUrl) {
  const params = new URLSearchParams({ _sort: 'date', _order: 'desc' });
  if (type) params.set('type', type);
  if (q) params.set('q', q);
  return request(`workouts?${params}`, {}, baseUrl);
}

export const getWorkout = (id, baseUrl) => request(`workouts/${id}`, {}, baseUrl);

export const createWorkout = (data, baseUrl) =>
  request('workouts', { method: 'POST', body: JSON.stringify(data) }, baseUrl);

export const replaceWorkout = (id, data, baseUrl) =>
  request(`workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }, baseUrl);

export const patchWorkout = (id, changes, baseUrl) =>
  request(`workouts/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }, baseUrl);

export const deleteWorkout = (id, baseUrl) =>
  request(`workouts/${id}`, { method: 'DELETE' }, baseUrl);