const BASE = process.env.BASE_URL || "http://localhost:3000";
async function tryFetch(path, opts = {}) {
  const url = BASE + path;
  const res = await fetch(url, { headers: { "Content-Type": "application/json", ...(opts.headers || {}) }, ...opts });
  return res;
}
async function json(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}
async function serverUp(){ try{ const r = await fetch(BASE); return r.ok || r.status===404; }catch{ return false; } }
module.exports = { tryFetch, json, serverUp, BASE };
