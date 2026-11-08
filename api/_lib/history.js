"use strict";
const MAX = 10;

const keyOf = t => t.id || ("local:" + t.title + "|" + t.artists);

const MAX_DURATION = 6 * 3600e3;
const durationOf = t => { const d = (+t.endMs || 0) - (+t.startMs || 0); if (t.startMs > 0 && d > 0 && d <= MAX_DURATION) return Math.round(d); return +t.durationMs >= 1000 && +t.durationMs <= MAX_DURATION ? Math.round(+t.durationMs) : 0; };

const norm = x => String(x || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const firstArtist = a => norm(String(a || "").split(",")[0]);
const sameSong = (a, b) => {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  const t = norm(a.title); return !!t && t === norm(b.title) && firstArtist(a.artists) === firstArtist(b.artists);
};

const REPEAT_SLACK = 2000, REPEAT_TOL = 20000;
const isRepeat = (older, newer) => +older.endMs > 0 && +newer.startMs > 0 && newer.startMs >= older.endMs - REPEAT_SLACK && newer.startMs - older.endMs <= REPEAT_TOL;

function collapse(items) {
  const out = [];
  for (const it of Array.isArray(items) ? items : []) {
    const a = out[out.length - 1];
    if (a && sameSong(a, it) && !isRepeat(it, a)) { if (!a.id && it.id) { a.id = it.id; a.url = it.url || a.url; } if (!a.cover && it.cover) a.cover = it.cover; if (!(+a.durationMs > 0) && +it.durationMs > 0) a.durationMs = it.durationMs; continue; }
    out.push(Object.assign({}, it));
  }
  return out.slice(0, MAX);
}

function applyTrack(items, track, nowIso) {
  const list = Array.isArray(items) ? items.slice(0, MAX) : [];
  if (!track || !track.title) return { items: list, added: false };
  const head = list[0];
  if (head && sameSong(head, track) && !isRepeat(head, track)) {
    const next = Object.assign({}, head); let changed = false;
    if (!next.id && track.id) { next.id = track.id; next.url = track.url || next.url; changed = true; }
    if (!next.cover && track.cover) { next.cover = track.cover; changed = true; }
    if (+track.startMs > 0 && (next.startMs !== track.startMs || next.endMs !== (track.endMs || 0))) { next.startMs = track.startMs; next.endMs = track.endMs || 0; changed = true; }
    const d = durationOf(track); if (!(+next.durationMs > 0) && d > 0) { next.durationMs = d; changed = true; }
    if (!changed) return { items: list, added: false };
    return { items: [next].concat(list.slice(1)), added: false, updated: true };
  }
  const entry = { id: track.id, title: track.title, artists: track.artists, album: track.album, cover: track.cover, url: track.url,
    playedAt: nowIso, startMs: track.startMs || 0, endMs: track.endMs || 0, durationMs: durationOf(track) };
  return { items: [entry].concat(list).slice(0, MAX), added: true };
}

const publicItems = items => (items || []).slice(0, MAX).map(i => ({ id: i.id, title: i.title, artists: i.artists, album: i.album, cover: i.cover, url: i.url, playedAt: i.playedAt, durationMs: (+i.durationMs > 0 && +i.durationMs <= MAX_DURATION) ? Math.round(+i.durationMs) : 0 }));

module.exports = { MAX, applyTrack, collapse, sameSong, publicItems, keyOf, durationOf };
