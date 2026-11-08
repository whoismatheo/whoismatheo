const crypto = require("crypto");
const { sendJson, allowGet, sendError } = require("./_lib/http");
const { sync } = require("./_lib/sync");

const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y); };

module.exports = async (req, res) => {
  if (!allowGet(req, res)) return;
  const secrets = [process.env.TRACK_SECRET, process.env.CRON_SECRET].filter(s => s && s.length >= 16);
  if (!secrets.length) return sendJson(res, 404, { error: "not_found" });
  const h = String((req.headers && req.headers.authorization) || "");
  const given = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!secrets.some(s => same(s, given))) return sendJson(res, 401, { error: "unauthorized" });
  try { const r = await sync(); sendJson(res, 200, { added: r.added, count: r.items.length, live: r.live }); }
  catch (e) { sendError(res, e, "api/track", "no-store"); }
};
