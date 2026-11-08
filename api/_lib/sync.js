"use strict";
const { fetchPresence, spotifyFrom, discordId } = require("./lanyard");
const { applyTrack, collapse, sameSong } = require("./history");
const lastfm = require("./lastfm");
const store = require("./storage");

const publicNow = t => t ? { id: t.id, title: t.title, artists: t.artists, album: t.album, cover: t.cover, url: t.url, durationMs: t.durationMs || 0 } : null;

async function sync() {
  let items = collapse(await store.loadItems());
  let track = null, live = true;
  try { track = spotifyFrom(await fetchPresence(discordId())); }
  catch (e) { live = false; console.error("[sync] presence unavailable:", e.code || e.message); }
  if (!track && lastfm.configured()) {
    try {
      track = await lastfm.nowPlaying(); if (track) live = true;
      if (track && !(items[0] && sameSong(items[0], track))) track.durationMs = await lastfm.duration(track);
    } catch (e) { console.error("[sync] last.fm unavailable:", e.code || e.message); }
  }
  if (!track) return { items, added: false, live, now: null };
  if (!(await store.lock())) return { items, added: false, live, now: publicNow(track) };
  try {
    const raw = await store.loadItems();
    items = collapse(raw);
    const r = applyTrack(items, track, new Date().toISOString());
    if (r.added || r.updated || items.length !== raw.length) await store.saveItems(r.items);
    return { items: r.items, added: r.added, live, now: publicNow(track) };
  } finally { await store.unlock(); }
}

module.exports = { sync };
