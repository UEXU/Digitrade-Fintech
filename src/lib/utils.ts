export function safeJsonParse(data: any, fallback: any = []) {
  if (!data) return fallback;
  if (typeof data !== 'string') return data;
  
  const trimmed = data.trim();
  // If it doesn't look like an object or array, don't even try parsing to avoid loud console errors
  if (!((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']')))) {
    return fallback;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('JSON Parse Error:', e, 'offending data:', data);
    return fallback;
  }
}
