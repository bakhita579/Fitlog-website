export function summarize(workouts, now = new Date()) {
    const workouts = workouts.length
    const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration || 0), 0);
  const weekWorkouts = workouts.filter((w) => isInLastSevenDays(w.date, now)).length;
    const byType = workouts.reduce((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  return { totalWorkouts, totalMinutes, weekWorkouts, topType, byType };
}
 export function formatMinutes(minutes) {
    const h = Math.floor (minutes/60)
    const m = minutes % 60
    return h ? `${h}h ${m}m` : `${m}m`
    
 }   
