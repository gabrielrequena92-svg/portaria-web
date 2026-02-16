// Test timezone conversion
// Run this in browser console on the dashboard page

// Simulate a UTC timestamp from Supabase
const utcTimestamp = "2026-02-15T23:50:00.000Z"; // 20:50 Brazil time (UTC-3)

console.log("UTC Timestamp:", utcTimestamp);
console.log("Expected Brazil time: 20:50");

// Test our conversion
const date = new Date(utcTimestamp);
const brazilTime = date.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
});

console.log("Converted Brazil time:", brazilTime);
console.log("Match:", brazilTime === "20:50");
