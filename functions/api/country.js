// Cloudflare supplies approximate IP geography; no IP, city or logs are exposed.
export function onRequestGet({request}) {
  const value = request.cf && request.cf.country;
  const country = typeof value === 'string' && /^[A-Z]{2}$/.test(value) && !['XX', 'T1'].includes(value) ? value : null;
  return new Response(JSON.stringify({country}), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Cloudflare-CDN-Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
