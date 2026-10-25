import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../js/api.js';

const BASE = 'http://test.local';
let calls;

function mockFetch(response) {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (response instanceof Error) throw response;
    return response;
  };
}
const ok = (body) => ({ ok: true, status: 200, json: async () => body });

beforeEach(() => { calls = []; });

test('getWorkouts sends GET with sort and filters', async () => {
  mockFetch(ok([{ id: 1 }]));
  const result = await api.getWorkouts({ type: 'Cardio', q: 'run' }, BASE);
  assert.deepEqual(result, [{ id: 1 }]);
  assert.match(calls[0].url, /workouts\?_sort=date&_order=desc&type=Cardio&q=run/);
  assert.equal(calls[0].options.method, undefined);
});

test('getWorkout requests a single record', async () => {
  mockFetch(ok({ id: 5 }));
  await api.getWorkout(5, BASE);
  assert.equal(calls[0].url, `${BASE}/workouts/5`);
});

test('createWorkout sends POST with JSON body', async () => {
  mockFetch(ok({ id: 2 }));
  await api.createWorkout({ exercise: 'Row' }, BASE);
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.body, JSON.stringify({ exercise: 'Row' }));
});

test('replaceWorkout sends PUT', async () => {
  mockFetch(ok({}));
  await api.replaceWorkout(3, { a: 1 }, BASE);
  assert.equal(calls[0].options.method, 'PUT');
  assert.equal(calls[0].url, `${BASE}/workouts/3`);
});

test('patchWorkout sends PATCH', async () => {
  mockFetch(ok({}));
  await api.patchWorkout(3, { favorite: true }, BASE);
  assert.equal(calls[0].options.method, 'PATCH');
});

test('deleteWorkout sends DELETE', async () => {
  mockFetch(ok({}));
  await api.deleteWorkout(3, BASE);
  assert.equal(calls[0].options.method, 'DELETE');
});

test('non-2xx responses throw ApiError with status', async () => {
  mockFetch({ ok: false, status: 404, json: async () => ({}) });
  await assert.rejects(() => api.getWorkout(99, BASE), (e) => e instanceof api.ApiError && e.status === 404);
});

test('network failures throw a friendly ApiError', async () => {
  mockFetch(new TypeError('failed'));
  await assert.rejects(() => api.getWorkouts({}, BASE), /Cannot reach the server/);
});