"use strict";
const { timeout, fail } = require("./http");

const BASE = "https://api.lanyard.rest/v1/users/";
const ID_RE = /^\d{15,25}$/;
const DEFAULT_ID = "1356268956398387423";
const discordId = () => process.env.DISCORD_USER_ID || DEFAULT_ID;
const TRACK_RE = /^[A-Za-z0-9]{22}$/;

async function fetchPresence(userId) {
  if (!ID_RE.test(String(userId || ""))) throw fail(503, "not_configured", "invalid or missing DISCORD_USER_ID");
  let r;
  try { r = await fetch(BASE + userId, { headers: { Accept: "application/json" }, signal: timeout(8000) }); }
  catch (e) { throw fail(502, "lanyard_unreachable", String(e && e.message)); }
  if (r.status === 404) throw fail(502, "lanyard_not_monitored", "Lanyard does not monitor this user: join discord.gg/lanyard");
  if (!r.ok) throw fail(502, "lanyard_error", "lanyard " + r.status);
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!j || j.success !== true || !j.data || typeof j.data !== "object") throw fail(502, "lanyard_error", "unexpected lanyard payload");
  return j.data;
}

function spotifyActivity(data) {
  const a = data && Array.isArray(data.activities) ? data.activities.find(x => x && x.type === 2 && (x.id === "spotify:1" || x.name === "Spotify")) : null;
  if (!a || !a.details) return null;
  const img = String((a.assets && a.assets.large_image) || "").replace(/^spotify:/, "");
  return { song: a.details, artist: a.state || "", album: (a.assets && a.assets.large_text) || "", track_id: a.sync_id || "",
    album_art_url: /^[A-Za-z0-9]{20,}$/.test(img) ? "https://i.scdn.co/image/" + img : "", timestamps: a.timestamps || {} };
}
function spotifyFrom(data) {
  const s = (data && data.listening_to_spotify && data.spotify) || spotifyActivity(data);
  if (!s || typeof s !== "object" || !s.song) return null;
  const id = TRACK_RE.test(String(s.track_id || "")) ? s.track_id : "";
  const start = Number(s.timestamps && s.timestamps.start) || 0, end = Number(s.timestamps && s.timestamps.end) || 0;
  return {
    id,
    title: String(s.song),
    artists: String(s.artist || "").split(";").map(x => x.trim()).filter(Boolean).join(", "),
    album: String(s.album || ""),
    cover: /^https:\/\//.test(s.album_art_url || "") ? s.album_art_url : "",
    url: id ? "https://open.spotify.com/track/" + id : "",
    startMs: start, endMs: end > start ? end : 0
  };
}

module.exports = { fetchPresence, spotifyFrom, discordId, ID_RE, TRACK_RE };
