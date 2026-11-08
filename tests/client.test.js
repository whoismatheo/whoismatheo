"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const root = path.join(__dirname, ".."), code = fs.readFileSync(path.join(root, "script.js"), "utf8"), html = fs.readFileSync(path.join(root, "index.html"), "utf8");

class El {
  constructor(tag) { this.tagName = String(tag).toLowerCase(); this.children = []; this.style = { setProperty() {} }; this.dataset = {}; this._a = {}; this.hidden = false; this.textContent = ""; this.value = "0"; this.min = "0"; this.max = "1"; this.disabled = false; this.offsetWidth = 0; this.offsetLeft = 0; this.scrollLeft = 0; this.scrollWidth = 0; this.clientWidth = 0; this.parentNode = { hidden: false }; const s = new Set();
    this.classList = { add: c => s.add(c), remove: c => s.delete(c), contains: c => s.has(c), toggle: (c, f) => { const on = f === undefined ? !s.has(c) : !!f; on ? s.add(c) : s.delete(c); return on; } };
    for (const k of ["src", "href"]) Object.defineProperty(this, k, { get: () => (k in this._a ? this._a[k] : undefined), set: v => { this._a[k] = String(v); } }); }
  setAttribute(k, v) { this._a[k] = String(v); } getAttribute(k) { return k in this._a ? this._a[k] : null; } removeAttribute(k) { delete this._a[k]; }
  appendChild(n) { this.children.push(n); return n; } append(...n) { this.children.push(...n); } replaceChildren(...n) { this.children = n; }
  querySelectorAll(sel) { const out = []; (function w(e) { for (const c of e.children) { if (sel === "time[datetime]" ? c.tagName === "time" && "datetime" in c._a : false) out.push(c); w(c); } })(this); return out; }
  addEventListener() {} remove() {} scrollTo(o) { this.scrollLeft = o.left; } focus() {} showModal() {} close() {} getBoundingClientRect() { return { left: 100 }; }
  text() { return this.textContent + this.children.map(c => (typeof c === "string" ? c : c.text())).join(""); }
}
const tick = (ms = 30) => new Promise(r => setTimeout(r, ms));

async function boot({ presence, profile, recent, playBehavior = "resolve", store = {}, lang }) {
  const els = {}, handlers = {}, audioInstances = [], playCalls = { n: 0 }, fetched = [], sockets = [];
  const doc = { hidden: false, documentElement: new El("html"), querySelector: s => els[s] || (els[s] = new El("x")), querySelectorAll: () => [], createElement: t => new El(t), addEventListener: (e, f) => (handlers[e] = handlers[e] || []).push(f) };
  doc.documentElement.dataset = {}; doc.querySelector("#lang-menu").children = [];
  class Audio { constructor() { audioInstances.push(this); this.paused = true; this.volume = 1; this.muted = false; this.readyState = 0; this.error = null; this.duration = 121; this.currentTime = 0; this._l = {}; }
    addEventListener(e, f) { (this._l[e] = this._l[e] || []).push(f); } pause() { this.paused = true; (this._l.pause || []).forEach(f => f()); }
    play() { playCalls.n++; if (playBehavior === "NotAllowedError" || playBehavior === "AbortError") { const e = new Error("x"); e.name = playBehavior; return Promise.reject(e); }
      this.paused = false; this.readyState = 4; (this._l.play || []).forEach(f => f()); this.onplaying && this.onplaying(); return Promise.resolve(); } }
  class WebSocket { constructor(u) { this.url = u; this.readyState = 1; sockets.push(this); } close() {} send() {} }
  const mem = Object.assign({}, store); if (lang) mem.lang = lang;
  const ctx = { document: doc, Audio, WebSocket, Intl, Date, Math, console, setTimeout, clearTimeout, setInterval, clearInterval, AbortController, Promise, JSON, isFinite, parseFloat, isNaN, Number, Array, Object, String,
    localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } }, matchMedia: () => ({ matches: false }), requestAnimationFrame: () => 0, addEventListener: (e, f) => (handlers[e] = handlers[e] || []).push(f), scrollY: 0, innerWidth: 1000,
    fetch: async (url) => { fetched.push(String(url)); const pick = u => (typeof u === "function" ? u() : u);
      if (String(url).startsWith("/api/recent")) return pick(recent.cur); if (String(url).startsWith("/api/profile")) return pick(profile.cur); if (String(url).includes("oembed")) return resp({}, 404); throw new Error("blocked " + url); } };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: "script.js" });
  await tick();
  const push = async d => { const s = sockets[sockets.length - 1]; s.onmessage({ data: JSON.stringify({ op: 1, d: { heartbeat_interval: 3600000 } }) }); s.onmessage({ data: JSON.stringify({ op: 0, d }) }); await tick(); };
  const p = { $: s => doc.querySelector(s), doc, push, sockets, audioInstances, playCalls, fetched, mem, fire: async ev => { (handlers[ev] || []).forEach(f => f()); await tick(); } };
  if (presence) await push(presence);
  return p;
}
const resp = (body, status = 200, headers = {}) => ({ ok: status >= 200 && status < 300, status, headers: { get: k => headers[k.toLowerCase()] ?? null }, json: async () => body });
const holder = v => ({ cur: v });
const NOPROF = () => holder(resp({ error: "unavailable" }, 502)), NOREC = () => holder(resp({ items: [] }));
const ID = "1356268956398387423", TID = "0VjIjW4GlUZAMYd2vXMi3b";
const user = { id: ID, username: "matheo", global_name: "Matheo", avatar: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4" };
const pres = (extra) => Object.assign({ discord_user: user, discord_status: "online", activities: [], listening_to_spotify: false, spotify: null }, extra);
const spot = (o) => Object.assign({ track_id: TID, song: "Blinding Lights", artist: "The Weeknd; Other", album: "After Hours", album_art_url: "https://i.scdn.co/image/abc", timestamps: { start: Date.now() - 61000, end: Date.now() + 139000 } }, o);
const item = (i, extra) => Object.assign({ id: "h" + i, title: "Song " + i, artists: "Art", album: "Album " + i, durationMs: 200000 + i * 1000, cover: "https://i.scdn.co/c" + i, url: "https://open.spotify.com/track/h" + i, playedAt: new Date(Date.UTC(2026, 9, 27, 12, 0) - i * 3600e3).toISOString() }, extra);
const profile = (o) => resp(Object.assign({ id: ID, username: "matheo", displayName: "Matheo", avatar: "https://cdn.discordapp.com/avatars/" + ID + "/x.png?size=256", avatarStatic: "https://cdn.discordapp.com/avatars/" + ID + "/x.png?size=256", decoration: "", banner: null, accentColor: "", badges: [], bannerSource: "no_token" }, o));

let passed = 0; const tests = []; const test = (n, f) => tests.push([n, f]);

test("static: Music nav -> history section; carousel + banner elements exist; no Spotify Web API/OAuth in the page code", () => {
  assert(html.includes('<a href="#history" data-i18n="music"></a>')); for (const id of ["history", "hist", "car-prev", "car-next", "car-dots", "banner", "banner-img", "badges", "custom", "av-deco", "spotify"]) assert(html.includes('id="' + id + '"'), "missing #" + id);
  assert(!/api\.spotify\.com|accounts\.spotify\.com|\/api\/now|\/api\/spotify|refresh_token/.test(code));
  assert(code.includes("wss://api.lanyard.rest/socket"), "the existing Discord (Lanyard) connection is still used");
});
test("dedication: exact text, looping muted video slot at assets/dedication.mp4 (contain), no title; carousel is its own section (no card box)", () => {
  const text = "Hay quienes pasan por la pantalla como una notificación más, y hay quienes se quedan porque de verdad le cambian el sentido a los días. Tú eres de los segundos. Gracias por las charlas que se alargaban sin planearlo, por estar siempre presente y por apoyar siempre, sin necesidad de pedir nada a cambio. Si tuviera que apartar un espacio exclusivo entre tanto ruido, pantallas y proyectos, este rincón es el que guardo para ti: un lugar permanente para alguien que vale la pena. Gracias por la amistad, Take.\n\n— Matheo";
  const T = vm.runInNewContext("(" + code.match(/const T = (\{[\s\S]*?\n\});/)[1] + ")"); assert.equal(T.dedication[1], text, "Spanish text exactly as written");
  for (let i = 0; i < 5; i++) { assert(T.dedication[i].length > 300 && T.dedication[i].endsWith("— Matheo") && /Take\./.test(T.dedication[i]), "dedication translated in language " + i); } assert.equal(new Set(T.dedication).size, 5, "five different texts");
  const cfg = vm.runInNewContext("(" + code.match(/const CONFIG = (\{[\s\S]*?\n\});/)[1] + ")"); assert.equal(cfg.dedicationMessage, "", "empty = use the translations");
  const dlg = html.slice(html.indexOf('<dialog id="letter"'), html.indexOf("</dialog>"));
  assert(!/<h[1-6]/.test(dlg) && !dlg.includes("l-title") && !dlg.includes("letterFor"), "no title in the dedication"); assert(dlg.includes('<video') && dlg.includes('src="assets/dedication.mp4"') && /\bmuted\b/.test(dlg) && /\bloop\b/.test(dlg) && /playsinline/.test(dlg) && dlg.includes('id="l-body"') && !dlg.includes('.gif'));
  const css = fs.readFileSync(path.join(root, "style.css"), "utf8"); assert(/\.ded-gif video\{[^}]*object-fit:contain/.test(css)); assert(/\.ded\{[^}]*grid-template-columns:1fr 1fr/.test(css)); assert(/@media\(max-width:767px\)\{[^]*\.ded\{grid-template-columns:1fr/.test(css));
  assert(!/<section id="history" class="[^"]*\bcard\b/.test(html), "history is not a card"); assert(/id="act-sp"[\s\S]*<svg[\s\S]*class="eq"/.test(html) && /\.act-sp svg\{[^}]*fill:currentColor/.test(fs.readFileSync(path.join(root, "style.css"), "utf8")), "mono Spotify logo + bars in the activity line"); assert(!html.includes("<time"));
});
test("dedication is rendered in the active language (all 5)", async () => {
  const T = vm.runInNewContext("(" + code.match(/const T = (\{[\s\S]*?\n\});/)[1] + ")");
  for (const [i, lang] of ["en", "es", "ru", "de", "fr"].entries()) { const p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC(), lang }); assert.equal(p.$("#l-body").textContent, T.dedication[i], "dedication in " + lang); }
});
test("spotify: when Lanyard's parsed `spotify` object is missing, the raw Discord activity (type 2) is used", async () => {
  const act = { type: 2, id: "spotify:1", name: "Spotify", details: "Raw Song", state: "A; B", sync_id: "T".repeat(22), assets: { large_image: "spotify:ab67616d0000b27364840995fe43bb2ec73a241d", large_text: "Raw Album" }, timestamps: { start: 1000, end: 181000 } };
  const p = await boot({ presence: pres({ activities: [act], listening_to_spotify: false, spotify: null }), profile: NOPROF(), recent: NOREC() });
  assert.equal(p.$("#sp-song").textContent, "Raw Song"); assert.equal(p.$("#sp-song").href, "https://open.spotify.com/track/" + "T".repeat(22)); assert.equal(p.$("#sp-art").src, "https://i.scdn.co/image/ab67616d0000b27364840995fe43bb2ec73a241d");
  const q = await boot({ presence: pres({ activities: [{ type: 2, name: "Not Spotify", details: "x" }, { type: 0, name: "Spotify", details: "game" }] }), profile: NOPROF(), recent: NOREC() }); assert.notEqual(q.$("#sp-song").textContent, "x"); assert.notEqual(q.$("#sp-song").textContent, "game");
});
test("Spotify card falls back to the song reported by /api/recent (Last.fm on the server) when Discord shows none; Discord has priority; stale/invalid `now` is ignored", async () => {
  const now = { title: "Now Song", artists: "X, Y", album: "Alb", cover: "https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg", url: "https://open.spotify.com/search/Now%20Song%20X" };
  let p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now })) });
  assert(p.$("#spotify").classList.contains("playing")); assert.equal(p.$("#sp-song").textContent, "Now Song"); assert.equal(p.$("#sp-song").href, now.url); assert.equal(p.$(".sp-prog").hidden, true, "no timestamps -> no progress bar"); assert.equal(p.$("#sp-art").src, now.cover);
  p = await boot({ presence: pres({ listening_to_spotify: true, spotify: spot({ song: "From Discord" }) }), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now })) }); assert.equal(p.$("#sp-song").textContent, "From Discord");
  p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now: null })) }); assert(p.$("#spotify").classList.contains("idle"));
  p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now: Object.assign({}, now, { url: "https://evil.example/x", cover: "http://x/y.png" }) })) }); assert(p.$("#spotify").classList.contains("idle"), "a non-Spotify link is rejected");
});
test("activity line: while music is the only activity it shows the Spotify logo + rhythm bars (no repeated words); idle still says 'no current activity'; a real activity wins", async () => {
  const now = { title: "Now Song", artists: "X", album: "A", cover: "", url: "https://open.spotify.com/search/x" };
  let p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now })) }); assert.equal(p.$("#act-sp").hidden, false); assert.equal(p.$("#activity").textContent, ""); assert.equal(p.$("#activity").style.display, "none"); assert.equal(p.$("#sp-label").textContent, "listening to spotify", "the words appear once, in the Spotify block");
  p = await boot({ presence: pres({ listening_to_spotify: true, spotify: spot({ song: "From Discord" }) }), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#act-sp").hidden, false); assert.equal(p.$("#activity").textContent, "");
  p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#activity").textContent, "no current activity"); assert.equal(p.$("#act-sp").hidden, true); assert.notEqual(p.$("#activity").style.display, "none");
  p = await boot({ presence: pres({ activities: [{ type: 0, name: "Game", details: "Level 2" }] }), profile: NOPROF(), recent: holder(resp({ items: [item(1)], now })) }); assert.equal(p.$("#activity").textContent, "Game — Level 2"); assert.equal(p.$("#act-sp").hidden, true);
});
test("current song comes from Discord presence: label, title + Spotify link, artists, album, cover, progress, indicator; no Spotify API requests", async () => {
  const p = await boot({ presence: pres({ listening_to_spotify: true, spotify: spot() }), profile: NOPROF(), recent: NOREC() });
  assert.equal(p.$("#sp-label").textContent, "listening to spotify"); assert.equal(p.$("#sp-song").textContent, "Blinding Lights"); assert.equal(p.$("#sp-song").href, "https://open.spotify.com/track/" + TID);
  assert.equal(p.$("#sp-artist").textContent, "The Weeknd, Other"); assert.equal(p.$("#sp-album").textContent, "After Hours"); assert.equal(p.$("#sp-art").src, "https://i.scdn.co/image/abc");
  assert(p.$("#spotify").classList.contains("playing")); assert.equal(p.$(".sp-prog").hidden, false); assert.equal(p.$("#sp-cur").textContent, "1:01"); assert.equal(p.$("#sp-dur").textContent, "3:20");
  assert(p.fetched.every(u => u.startsWith("/api/profile") || u.startsWith("/api/recent") || u.includes("oembed")), "only own endpoints: " + p.fetched.join());
});
test("no song: idle state with the quiet message; song disappears when Discord stops reporting it; never claims 'listening' falsely", async () => {
  const p = await boot({ presence: pres({ listening_to_spotify: true, spotify: spot() }), profile: NOPROF(), recent: NOREC() });
  await p.push(pres()); assert.equal(p.$("#sp-label").textContent, "nothing playing right now"); assert(p.$("#spotify").classList.contains("idle")); assert.equal(p.$("#sp-song").textContent, ""); assert.equal(p.$("#sp-song").href, undefined); assert.equal(p.$(".sp-prog").hidden, true);
});
test("song change updates the card; incomplete data: no track id -> no link; no timestamps -> no progress bar (only reliable data)", async () => {
  const p = await boot({ presence: pres({ listening_to_spotify: true, spotify: spot() }), profile: NOPROF(), recent: NOREC() });
  await p.push(pres({ listening_to_spotify: true, spotify: spot({ song: "Second", track_id: null, timestamps: {}, album_art_url: "" }) }));
  assert.equal(p.$("#sp-song").textContent, "Second"); assert.equal(p.$("#sp-song").href, undefined); assert.equal(p.$(".sp-prog").hidden, true); assert.equal(p.$("#sp-art").style.display, "none");
  await p.push(pres({ listening_to_spotify: true, spotify: spot({ track_id: "../evil", timestamps: { start: 5, end: 1 } }) })); assert.equal(p.$("#sp-song").href, undefined); assert.equal(p.$(".sp-prog").hidden, true);
});
test("Discord connection lost before any data -> unavailable (not 'listening')", async () => {
  const p = await boot({ profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#sp-label").textContent, "loading");
});
test("banner: real banner URL from /api/profile is shown as the header; static fallback when there is none; foreign hosts are rejected", async () => {
  const url = "https://cdn.discordapp.com/banners/" + ID + "/b.gif?size=1024";
  let p = await boot({ presence: pres(), profile: holder(profile({ banner: { url, staticUrl: url.replace(".gif", ".png"), animated: true }, accentColor: "#2b6cb0", bannerSource: "ok" })), recent: NOREC() });
  assert.equal(p.$("#banner-img").src, url); assert.equal(p.$("#banner-img").hidden, false); assert.equal(p.$("#banner").dataset.has, "1");
  p = await boot({ presence: pres(), profile: holder(profile({ banner: null })), recent: NOREC() }); assert.equal(p.$("#banner-img").hidden, true); assert.equal(p.$("#banner").dataset.has, "0"); assert.equal(p.$("#banner-img").src, undefined, "no banner is invented");
  p = await boot({ presence: pres(), profile: holder(profile({ banner: { url: "https://evil.example/x.png", staticUrl: "https://evil.example/x.png", animated: false } })), recent: NOREC() }); assert.equal(p.$("#banner-img").hidden, true);
  p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#banner").dataset.has, "0"); assert.equal(p.$("#name").textContent, "Matheo");
});
test("profile card: avatar, name, @username, status, custom status, activity, decoration only when provided", async () => {
  const acts = [{ type: 4, name: "Custom Status", state: "studying", emoji: { name: "📚" } }, { type: 0, name: "Visual Studio Code", details: "Editing script.js" }];
  const dec = "https://cdn.discordapp.com/avatar-decoration-presets/a_x.png?size=160&passthrough=true";
  let p = await boot({ presence: pres({ discord_status: "dnd", activities: acts }), profile: holder(profile({ decoration: dec })), recent: NOREC() });
  assert.equal(p.$("#name").textContent, "Matheo"); assert.equal(p.$("#uname").textContent, "@matheo"); assert.equal(p.$("#status").textContent, "do not disturb"); assert.equal(p.$("#st-dot").dataset.s, "dnd");
  assert.equal(p.$("#custom").textContent, "📚 studying"); assert.equal(p.$("#custom").hidden, false); assert.equal(p.$("#activity").textContent, "Visual Studio Code — Editing script.js"); assert.equal(p.$("#av-deco").src, dec); assert.equal(p.$("#av-deco").hidden, false);
  p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#av-deco").hidden, true); assert.equal(p.$("#custom").hidden, true); assert.equal(p.$("#activity").textContent, "no current activity");
  for (const [st, txt] of [["online", "online"], ["idle", "idle"], ["offline", "offline"]]) { await p.push(pres({ discord_status: st })); assert.equal(p.$("#status").textContent, txt); }
});
test("badges: only the ones reported are shown, translated; unknown keys ignored; none -> list hidden; no bio is invented", async () => {
  let p = await boot({ presence: pres(), profile: holder(profile({ badges: ["hypesquadBravery", "activeDeveloper", "madeUpBadge"] })), recent: NOREC() });
  assert.deepEqual(p.$("#badges").children.map(li => li.textContent), ["HypeSquad Bravery", "Active Developer"]); assert.equal(p.$("#badges").hidden, false);
  p = await boot({ presence: pres(), profile: holder(profile({ badges: ["activeDeveloper"] })), recent: NOREC(), lang: "fr" }); assert.deepEqual(p.$("#badges").children.map(li => li.textContent), ["Développeur actif"]);
  p = await boot({ presence: pres(), profile: holder(profile({ badges: [] })), recent: NOREC() }); assert.equal(p.$("#badges").hidden, true);
});
test("bio: hidden when unavailable (no empty box); shown from the owner's Lanyard KV 'bio' or /api/profile, line breaks kept, safe formatting only, never HTML", async () => {
  let p = await boot({ presence: pres(), profile: holder(profile()), recent: NOREC() }); assert.equal(p.$("#bio").hidden, true); assert.equal(p.$("#bio").children.length, 0);
  p = await boot({ presence: pres({ kv: { bio: "Hola **Matheo**\\nsegunda línea <img src=x onerror=alert(1)>" } }), profile: NOPROF(), recent: NOREC() });
  assert.equal(p.$("#bio").hidden, false); const t = p.$("#bio").text(); assert(t.includes("Hola Matheo\nsegunda línea <img src=x onerror=alert(1)>"), t); assert.equal(p.$("#bio").children.find(c => typeof c !== "string").tagName, "b"); assert(!p.$("#bio").children.some(c => typeof c !== "string" && c.tagName === "img"));
  p = await boot({ presence: pres(), profile: holder(profile({ bio: "desde la API" })), recent: NOREC() }); assert.equal(p.$("#bio").text(), "desde la API");
  p = await boot({ presence: pres({ kv: { bio: 7 } }), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#bio").hidden, true);
});
test("banner: if the image fails to load the clean fallback is shown instead of a broken image; accent colour is used flat when there is no banner", async () => {
  const url = "https://cdn.discordapp.com/banners/" + ID + "/b.png?size=1024"; const p = await boot({ presence: pres(), profile: holder(profile({ banner: { url, staticUrl: url, animated: false } })), recent: NOREC() });
  assert.equal(p.$("#banner").dataset.has, "1"); p.$("#banner-img").onerror({ target: p.$("#banner-img") }); assert.equal(p.$("#banner-img").hidden, true); assert.equal(p.$("#banner").dataset.has, "0");
  const q = await boot({ presence: pres(), profile: holder(profile({ banner: null, accentColor: "#2b6cb0" })), recent: NOREC() }); assert.equal(q.$("#banner").dataset.acc, "1"); assert.equal(q.$("#banner-img").hidden, true);
});
test("carousel: up to 10, newest first, cover/title/artist/time/link; entries without a Spotify link are dropped (foreign host) or shown without link (none)", async () => {
  const items = Array.from({ length: 12 }, (_, i) => item(i)); items.splice(3, 0, item(99, { url: "https://evil.example/" })); items.push(item(50, { url: "" }));
  const p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items })) }); const lis = p.$("#hist").children;
  assert.equal(lis.length, 10); assert.deepEqual(lis.map(li => li.children[0].children[1].textContent).slice(0, 4), ["Song 0", "Song 1", "Song 2", "Song 4"].map((x, k) => k === 3 ? "Song 3" : x).slice(0, 3).concat(["Song 3"]));
  const a = lis[0].children[0]; assert.equal(a.href, "https://open.spotify.com/track/h0"); assert.equal(a.children[0].className, "cv"); assert.equal(a.children[0].children[0].src, "https://i.scdn.co/c0", "cover is the first, main element");
  assert.equal(a.children[1].textContent, "Song 0"); assert.equal(a.children[2].textContent, "Art"); const m = a.children[3]; assert.equal(m.hidden, false); assert.equal(m.children[0].textContent, "3:20", "duration m:ss"); assert.equal(m.children[1].textContent, "Album 0");
  assert(!a.children.some(c => c.tagName === "time") && !JSON.stringify(a.text()).match(/\d{1,2}:\d{2}\s?(AM|PM)/i), "the time a song was played is NOT shown");
  assert.equal(p.$("#hist").hidden, false); assert.equal(p.$("#hist-msg").hidden, true); assert.equal(p.$("#history").hidden, false); assert.equal(p.$("#car-dots").children.length, 10); assert.equal(p.$("#car-dots").hidden, false);
});
test("carousel: a repeated song after others is shown twice (two plays)", async () => {
  const items = [item(1, { id: "A" }), item(2, { id: "B" }), item(3, { id: "A" })]; const p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items })) }); assert.equal(p.$("#hist").children.length, 3);
});
test("carousel: songs without duration/album (older entries) still render cleanly; a broken cover falls back to a placeholder; bad durations are ignored", async () => {
  const items = [item(1, { durationMs: undefined, album: "" }), item(2, { durationMs: 0 }), item(3, { durationMs: 99999999999 }), item(4, { cover: "" }), item(5, { durationMs: 61000, album: "" })];
  const p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items })) }), lis = p.$("#hist").children;
  assert.equal(lis.length, 5); assert.equal(lis[0].children[0].children[3].hidden, true, "no duration + no album -> no empty meta line");
  assert.equal(lis[1].children[0].children[3].children.length, 1); assert.equal(lis[1].children[0].children[3].children[0].tagName, "em", "album only");
  assert.equal(lis[2].children[0].children[3].children[0].tagName, "em", "absurd duration ignored"); assert(lis[3].children[0].children[0].classList.contains("ph"), "no cover -> placeholder");
  assert.equal(lis[4].children[0].children[3].children[0].textContent, "1:01", "duration only"); assert.equal(lis[4].children[0].children[3].children.length, 1);
  const im = lis[0].children[0].children[0].children[0]; im.onerror(); assert(lis[0].children[0].children[0].classList.contains("ph"), "broken cover image -> placeholder");
});
test("carousel: fewer than 10 shows only those; empty -> message; error -> message, then recovers; a failure keeps the last good carousel", async () => {
  let p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)] })) }); assert.equal(p.$("#hist").children.length, 1); assert.equal(p.$("#car-dots").hidden, true);
  p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert.equal(p.$("#hist-msg").textContent, "no recent plays to show yet"); assert.equal(p.$("#hist").hidden, true);
  const rec = holder(resp({ error: "storage_not_configured" }, 503)); p = await boot({ presence: pres(), profile: NOPROF(), recent: rec }); assert.equal(p.$("#hist-msg").textContent, "recent plays are unavailable right now"); assert.equal(p.$("#history").hidden, false);
  rec.cur = resp({ items: [item(1)] }); await p.fire("visibilitychange"); assert.equal(p.$("#hist").children.length, 1); assert.equal(p.$("#hist-msg").hidden, true);
  rec.cur = resp({ error: "x" }, 502); await p.fire("visibilitychange"); assert.equal(p.$("#hist").children.length, 1, "last good list kept on a transient error"); assert.equal(p.$("#hist-msg").hidden, true);
  rec.cur = { ok: true, status: 200, headers: { get: () => null }, json: async () => { throw new Error("bad json"); } }; await p.fire("visibilitychange"); assert.equal(p.$("#hist").children.length, 1);
});
test("coverflow: newest in the centre, neighbours overlap on both sides, arrows loop endlessly, dots and side-cover clicks move the centre", async () => {
  const items = Array.from({ length: 10 }, (_, i) => item(i)); const p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items })) }), L = p.$("#hist").children, o = () => L.map(li => li.dataset.o).join(",");
  assert.equal(o(), "0,1,2,3,3,3,-3,-3,-2,-1", "song 1 centred, 2-3 on the right, 9-10 on the left (shortest way round)");
  assert.equal(L[0].getAttribute("aria-current"), "true"); assert.equal(L[0].children[0].tabIndex, 0); assert.equal(L[1].children[0].tabIndex, -1);
  assert.equal(p.$("#car-prev").disabled, false); assert.equal(p.$("#car-next").disabled, false, "endless: never disabled with 2+ songs");
  p.$("#car-next").onclick(); assert.equal(L[1].dataset.o, "0"); assert.equal(L[0].dataset.o, "-1"); assert.equal(p.$("#car-dots").children[1].getAttribute("aria-current"), "true");
  p.$("#car-prev").onclick(); p.$("#car-prev").onclick(); assert.equal(L[9].dataset.o, "0", "prev from the first wraps to the last"); assert.equal(L[0].dataset.o, "1");
  p.$("#car-dots").children[4].onclick(); assert.equal(L[4].dataset.o, "0"); assert.equal(p.$("#car-dots").children[4].getAttribute("aria-current"), "true");
  for (let k = 0; k < 6; k++) p.$("#car-next").onclick(); assert.equal(L[0].dataset.o, "0", "after 10 steps it is back at the start");
});
test("coverflow: a single song has no arrows to press and no dots; the page never needs horizontal scrolling logic", async () => {
  const p = await boot({ presence: pres(), profile: NOPROF(), recent: holder(resp({ items: [item(1)] })) }); assert.equal(p.$("#hist").children[0].dataset.o, "0"); assert.equal(p.$("#car-next").disabled, true); assert.equal(p.$("#car-dots").hidden, true);
  assert(!/scrollLeft|scrollTo/.test(code.slice(code.indexOf("Recently played carousel"))), "no scroll-based carousel code left");
});
test("no request while the tab is hidden; one immediate refresh when it becomes visible", async () => {
  const p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); const count = () => p.fetched.filter(u => u === "/api/recent").length; const n0 = count();
  p.doc.hidden = true; await p.fire("visibilitychange"); assert.equal(count(), n0); p.doc.hidden = false; await p.fire("visibilitychange"); assert(count() >= n0 + 0);
});
test("languages: every text has 5 non-empty translations; ALL original translations are unchanged; new texts exist in en/es/ru/de/fr", () => {
  const grab = src => { const m = src.match(/const T = (\{[\s\S]*?\n\});/); return vm.runInNewContext("(" + m[1] + ")"); };
  const T = grab(code), O = JSON.parse(fs.readFileSync(path.join(__dirname, "original-translations.json"), "utf8"));
  for (const k of Object.keys(O)) assert.deepEqual(T[k], O[k], "original translation changed: " + k);
  for (const [k, v] of Object.entries(T)) { assert.equal(v.length, 5, k); v.forEach(x => assert(typeof x === "string" && x.trim(), k + " empty")); }
  for (const k of ["prev", "next", "song", "duration", "badges", "history", "historyEmpty", "historyError", "nothingPlaying", "listening", "openSpotify", "loading", "online", "idle", "dnd", "offline", "noActivity"]) assert(T[k], "missing " + k);
  assert(Object.keys(T).filter(k => k.startsWith("b_")).length >= 12); assert.deepEqual(T.history, ["recently played", "escuchado recientemente", "недавно прослушано", "zuletzt gehört", "écouté récemment"]);
  assert(/data-i18n-label="prev"/.test(html) && /data-i18n-label="next"/.test(html));
});
test("languages: carousel, states and Spotify labels render in ru / de / fr / es", async () => {
  for (const [lang, empty, listening, dnd] of [["ru", "пока нет недавних прослушиваний", "слушает spotify", "не беспокоить"], ["de", "noch keine zuletzt gehörten Titel", "hört spotify", "bitte nicht stören"], ["fr", "aucune écoute récente à afficher pour le moment", "écoute spotify", "ne pas déranger"], ["es", "aún no hay reproducciones recientes que mostrar", "escuchando spotify", "no molestar"]]) {
    const p = await boot({ presence: pres({ discord_status: "dnd", listening_to_spotify: true, spotify: spot() }), profile: NOPROF(), recent: NOREC(), lang });
    assert.equal(p.$("#hist-msg").textContent, empty); assert.equal(p.$("#sp-label").textContent, listening); assert.equal(p.$("#status").textContent, dnd);
  }
});
test("mini player removed: no player/mute/play controls in the page, no Audio object is created, no mp3 is referenced; nothing else lost (Spotify card, carousel, dedication)", async () => {
  for (const id of ["player", "mute", "play", "volume", "seek", "p-title", "cover"]) assert(!html.includes('id="' + id + '"'), "leftover #" + id);
  assert(!/new Audio|the-kill-2|\.mp3/.test(code), "no audio code left"); assert(!fs.existsSync(path.join(root, "audio")), "audio folder removed");
  const p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert.equal(p.audioInstances.length, 0); assert.equal(p.playCalls.n, 0);
  for (const id of ["spotify", "hist", "secret", "letter", "theme", "lang"]) assert(html.includes('id="' + id + '"'), "missing #" + id);
});
test("favicon: the tab icon is the Discord avatar (still image); assets/favicon.png is the first-paint fallback; Lanyard's avatar is used when /api/profile is down", async () => {
  assert(/<link id="favicon" rel="icon"[^>]*href="assets\/favicon\.png"/.test(html) && fs.existsSync(path.join(root, "assets/favicon.png")));
  let p = await boot({ presence: pres(), profile: holder(profile({ avatar: "https://cdn.discordapp.com/avatars/" + ID + "/a_anim.gif?size=256", avatarStatic: "https://cdn.discordapp.com/avatars/" + ID + "/still.png?size=256" })), recent: NOREC() });
  assert.equal(p.$("#favicon").getAttribute("href"), "https://cdn.discordapp.com/avatars/" + ID + "/still.png?size=256", "still version, never the animated gif");
  p = await boot({ presence: pres(), profile: NOPROF(), recent: NOREC() }); assert(/^https:\/\/cdn\.discordapp\.com\/avatars\//.test(p.$("#favicon").getAttribute("href") || ""), "fallback: Lanyard avatar");
  p = await boot({ presence: pres(), profile: holder(profile({ avatarStatic: "https://evil.example/x.png", avatar: "https://evil.example/x.png" })), recent: NOREC() }); assert(!/evil/.test(p.$("#favicon").getAttribute("href") || ""), "only Discord CDN images are used");
});

(async () => {
  const realLog = console.log; let pass = 0;
  for (const [name, fn] of tests) { try { await fn(); pass++; realLog("  ok   " + name); } catch (e) { realLog("  FAIL " + name + "\n       " + (e && e.stack || e)); process.exitCode = 1; } }
  realLog("\n" + pass + "/" + tests.length + " passed (fake DOM; not a real browser)"); process.exit(process.exitCode || 0);
})();
