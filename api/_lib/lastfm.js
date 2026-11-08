"use strict";
const { timeout, fail } = require("./http");

const BASE = "https://ws.audioscrobbler.com/2.0/";
const KEY_RE = /^[A-Fa-f0-9]{32}$/, USER_RE = /^[A-Za-z0-9_-]{2,15}$/;
const NO_ART = "2a96cbd8b46e442fc41c2b86b821562f";
const conf = () => { const k = process.env.LASTFM_API_KEY, u = process.env.LASTFM_USER; return KEY_RE.test(String(k || "")) && USER_RE.test(String(u || "")) ? { key: k, user: u } : null; };
const configured = () => !!conf();

async function get(params) {
  const c = conf(); if (!c) throw fail(503, "not_configured", "LASTFM_API_KEY / LASTFM_USER missing or invalid");
  const q = new URLSearchParams(Object.assign({ api_key: c.key, format: "json" }, params));
  let r; try { r = await fetch(BASE + "?" + q.toString(), { headers: { Accept: "application/json" }, signal: timeout(8000) }); }
  catch (e) { throw fail(502, "lastfm_unreachable", String(e && e.message)); }
  if (!r.ok) throw fail(502, "lastfm_error", "last.fm " + r.status);
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!j || typeof j !== "object" || j.error) throw fail(502, "lastfm_error", "unexpected last.fm payload");
  return j;
}

const txt = v => typeof v === "string" ? v : (v && typeof v === "object" && typeof v["#text"] === "string" ? v["#text"] : (v && typeof v.name === "string" ? v.name : ""));
const bestCover = imgs => { const l = Array.isArray(imgs) ? imgs.slice().reverse() : []; for (const i of l) { const u = i && i["#text"]; if (typeof u === "string" && /^https:\/\//.test(u) && !u.includes(NO_ART)) return u; } return ""; };

async function nowPlaying() {
  const j = await get({ method: "user.getrecenttracks", user: conf().user, limit: "1", extended: "1" });
  const list = j.recenttracks && j.recenttracks.track, t = Array.isArray(list) ? list[0] : list;
  if (!t || typeof t !== "object" || !(t["@attr"] && String(t["@attr"].nowplaying) === "true")) return null;
  const title = String(t.name || "").trim(), artists = txt(t.artist).trim(); if (!title) return null;
  return { id: "", title, artists, album: txt(t.album), cover: bestCover(t.image),
    url: "https://open.spotify.com/search/" + encodeURIComponent((title + " " + artists).trim()), startMs: 0, endMs: 0, durationMs: 0 };
}

async function duration(track) {
  try { const j = await get({ method: "track.getinfo", track: track.title, artist: track.artists.split(",")[0].trim() }); const d = +(j.track && j.track.duration); return d >= 1000 && d <= 6 * 3600e3 ? Math.round(d) : 0; }
  catch (_) { return 0; }
}

module.exports = { configured, nowPlaying, duration };
