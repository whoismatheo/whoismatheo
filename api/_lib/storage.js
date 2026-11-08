"use strict";
const { timeout, fail } = require("./http");

const KEY = "whoismatheo:recent-plays";
const LOCK = "whoismatheo:recent-plays:lock";

function conf() {
  const e = process.env;
  const url = e.UPSTASH_REDIS_REST_URL || e.KV_REST_API_URL, token = e.UPSTASH_REDIS_REST_TOKEN || e.KV_REST_API_TOKEN;
  if (!url || !token || !/^https:\/\//.test(url)) throw fail(503, "storage_not_configured", "missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN");
  return { url: url.replace(/\/+$/, ""), token };
}

async function cmd(args) {
  const c = conf(); let r;
  try { r = await fetch(c.url, { method: "POST", headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" }, body: JSON.stringify(args), signal: timeout(6000) }); }
  catch (e) { throw fail(502, "storage_unreachable", String(e && e.message)); }
  if (!r.ok) throw fail(502, "storage_error", "redis " + r.status);
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!j || j.error) throw fail(502, "storage_error", "redis: " + (j && j.error));
  return j.result;
}

async function loadItems() {
  const raw = await cmd(["GET", KEY]);
  if (raw == null) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch (_) { return []; }
}
const saveItems = items => cmd(["SET", KEY, JSON.stringify(items)]);
const lock = async () => (await cmd(["SET", LOCK, "1", "NX", "EX", "5"])) === "OK";
const unlock = () => cmd(["DEL", LOCK]).catch(() => {});

module.exports = { loadItems, saveItems, lock, unlock, KEY };
