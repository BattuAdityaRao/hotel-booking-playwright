export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function generateRandomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}
