
export const USE_SERVER = globalThis.FITLOG_USE_SERVER ?? false;


const LIVE_API = 'https://PASTE-YOUR-RENDER-ADDRESS-HERE.onrender.com';

const host = globalThis.location?.hostname;
const isLocal = !host || host === 'localhost' || host === '127.0.0.1';

export const API_URL = globalThis.FITLOG_API || (isLocal ? 'http://localhost:3000' : LIVE_API);

export const WORKOUT_TYPES = ['Strength', 'Cardio', 'Flexibility', 'Other'];