// Read-only live checks. Never print/store trace IPs, cookies, tokens or raw responses.
const fs = require('node:fs');
const crypto = require('node:crypto');
const origin = process.argv[2] || 'https://www.hurralingo.com';
if (!/^https:\/\/(?:www\.hurralingo\.com|hurralingo\.com|[a-z0-9-]+\.hurralingo-landing\.pages\.dev|hurralingo-landing\.pages\.dev)$/.test(origin)) {
  throw new Error('Use a Hurra Lingo HTTPS origin without a trailing slash.');
}
const normalize = value => value.replace(/\r\n/g, '\n');
const countryCode = value => typeof value === 'string' && /^[A-Z]{2}$/.test(value) && !['XX', 'T1'].includes(value) ? value : null;
async function inspect(path, type) {
  const start = performance.now();
  try {
    const response = await fetch(origin + path, {cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(10000)});
    const body = await response.text();
    const row = {path, status: response.status, durationMs: Math.round(performance.now() - start),
      cache: Object.fromEntries(['cache-control', 'cdn-cache-control', 'cf-cache-status', 'age'].map(key => [key, response.headers.get(key)]))};
    if (type === 'trace') {
      // Deliberately allowlist two fields; raw trace includes an IP and must never be output.
      const fields = Object.fromEntries(body.split('\n').map(line => line.split('=')));
      row.country = countryCode(fields.loc);
      row.colo = /^[A-Z]{3}$/.test(fields.colo || '') ? fields.colo : null;
    } else if (type === 'country') {
      try {
        const data = JSON.parse(body);
        row.validCountryResponse = !!data && !Array.isArray(data) && Object.keys(data).length === 1 && Object.hasOwn(data, 'country') && (data.country === null || countryCode(data.country) !== null);
        row.country = countryCode(data && data.country);
      } catch (_) { row.validCountryResponse = false; row.country = null; }
    } else {
      const source = normalize(fs.readFileSync(require('node:path').resolve(__dirname, '../assets/auto-language.js'), 'utf8'));
      row.matchesWorkingTree = response.ok && normalize(body) === source;
      row.sha256 = response.ok ? crypto.createHash('sha256').update(normalize(body)).digest('hex') : null;
    }
    return row;
  } catch (_) { return {path, error: 'Network request failed or timed out; no response payload was recorded.'}; }
}
(async () => {
  // Sequential checks use the same process/network and no authenticated browser state.
  const trace = await inspect('/cdn-cgi/trace', 'trace');
  const endpoint = await inspect('/api/country', 'country');
  const uniqueQuery = await inspect('/api/country?diagnosis=' + Date.now(), 'country');
  const asset = await inspect('/assets/auto-language.js', 'asset');
  const comparable = trace.status === 200 && trace.country !== null && endpoint.status === 200 && endpoint.validCountryResponse && uniqueQuery.status === 200 && uniqueQuery.validCountryResponse;
  const mismatch = comparable && (trace.country !== endpoint.country || trace.country !== uniqueQuery.country);
  const result = {checkedAt: new Date().toISOString(), origin, trace, endpoint, uniqueQuery, asset,
    comparison: !comparable ? 'inconclusive' : mismatch ? 'country-mismatch' : 'countries-match',
    scope: 'Same-origin HTTP checks from this process only. No VPN claim, browser preference inspection or production fix is implied.'};
  console.log(JSON.stringify(result, null, 2));
  if (!comparable || mismatch || !asset.matchesWorkingTree) process.exitCode = 1;
})().catch(() => { console.error('Diagnosis could not complete. No request payload was recorded.'); process.exitCode = 1; });
