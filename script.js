const CONFIG = {
  discordUserId: "1356268956398387423",
  dedicationMessage: ""
};
const LANGS = ["en","es","ru","de","fr"];
const T = {
 home:["home","inicio","главная","start","accueil"],
 about:["about me","sobre mí","обо мне","über mich","à propos"],
 music:["music","música","музыка","musik","musique"],
 theme:["Toggle theme","Cambiar tema","Сменить тему","Thema wechseln","Changer de thème"],
 language:["Language","Idioma","Язык","Sprache","Langue"],
 hero:["just another entity on the internet.","solo otra entidad en internet.","просто ещё одно существо в интернете.","nur ein weiteres Wesen im Internet.","juste une autre entité sur internet."],
 presence:["discord presence","presencia en discord","статус в discord","discord-präsenz","présence discord"],
 connecting:["connecting","conectando","подключение","verbinde","connexion"],
 live:["real time","tiempo real","онлайн","echtzeit","temps réel"],
 reconnecting:["reconnecting","reconectando","переподключение","verbinde neu","reconnexion"],
 unavailable:["unavailable","no disponible","недоступно","nicht verfügbar","indisponible"],
 notConfigured:["Discord ID not set","ID de Discord sin configurar","ID Discord не задан","Discord-ID nicht gesetzt","ID Discord non défini"],
 online:["online","en línea","в сети","online","en ligne"],
 idle:["idle","ausente","нет на месте","abwesend","inactif"],
 dnd:["do not disturb","no molestar","не беспокоить","bitte nicht stören","ne pas déranger"],
 offline:["offline","desconectado","не в сети","offline","hors ligne"],
 noActivity:["no current activity","sin actividad actual","нет активности","keine aktuelle Aktivität","aucune activité"],
 listening:["listening to spotify","escuchando spotify","слушает spotify","hört spotify","écoute spotify"],
 aboutTitle:["a bit of everything, I guess.","un poco de todo, supongo.","понемногу обо всём, наверное.","ein bisschen von allem, schätze ich.","un peu de tout, je suppose."],
 aboutP1:["I don’t always know what I’m doing, but I almost always end up finding something interesting.","No siempre sé qué estoy haciendo, pero casi siempre termino encontrando algo interesante.","Я не всегда понимаю, что делаю, но почти всегда в итоге нахожу что-нибудь интересное.","Ich weiß nicht immer, was ich gerade tue, aber fast immer finde ich am Ende etwas Interessantes.","Je ne sais pas toujours ce que je fais, mais je finis presque toujours par trouver quelque chose d’intéressant."],
 aboutP2:["I like ideas that appear out of nowhere, conversations that drag on for no reason, and those small things that make an ordinary day feel different.","Me gustan las ideas que aparecen de la nada, las conversaciones que se alargan sin motivo y esas pequeñas cosas que hacen que un día normal sea diferente.","Мне нравятся идеи, которые появляются из ниоткуда, разговоры, которые затягиваются без всякой причины, и те маленькие мелочи, которые делают обычный день особенным.","Ich mag Ideen, die aus dem Nichts auftauchen, Gespräche, die sich ohne Grund in die Länge ziehen, und diese kleinen Dinge, die einen normalen Tag anders machen.","J’aime les idées qui surgissent de nulle part, les conversations qui s’éternisent sans raison, et ces petites choses qui rendent un jour ordinaire différent."],
 aboutClose:["Under construction, like everyone else.","En construcción, como todo el mundo.","В разработке, как и все мы.","Im Aufbau, wie alle anderen auch.","En construction, comme tout le monde."],
 hint:["no presence received — join discord.gg/lanyard","sin datos de presencia — únete a discord.gg/lanyard","нет данных о статусе — вступите на discord.gg/lanyard","keine Präsenzdaten — tritt discord.gg/lanyard bei","aucune donnée de présence — rejoins discord.gg/lanyard"],
 seek:["Seek","Buscar","Перемотка","Suchen","Position"],
 play:["Play","Reproducir","Играть","Abspielen","Lecture"],
 pause:["Pause","Pausa","Пауза","Pause","Pause"],
 volume:["Volume","Volumen","Громкость","Lautstärke","Volume"],
 noTrack:["no track configured","sin canción configurada","трек не настроен","kein Titel eingestellt","aucun titre configuré"],
 playing:["playing","reproduciendo","играет","spielt","lecture"],
 paused:["paused","en pausa","пауза","pausiert","en pause"],
 tapToPlay:["tap play to start music","pulsa play para iniciar la música","нажмите play, чтобы включить музыку","Play drücken, um Musik zu starten","appuie sur lecture pour lancer la musique"],
 loadError:["couldn't load audio","no se pudo cargar el audio","не удалось загрузить аудио","Audio konnte nicht geladen werden","impossible de charger l'audio"],
 letterFor:["a letter for","una carta para","письмо для","ein Brief für","une lettre pour"],
 dedication:["Some people pass through the screen like just another notification, and some stay because they truly change the meaning of your days. You are one of the latter. Thank you for the conversations that dragged on without planning to, for always being there, and for always supporting me without ever asking for anything in return. If I had to set aside an exclusive space among so much noise, screens and projects, this corner is the one I keep for you: a permanent place for someone who is worth it. Thank you for the friendship, Take.\n\n— Matheo",
  "Hay quienes pasan por la pantalla como una notificación más, y hay quienes se quedan porque de verdad le cambian el sentido a los días. Tú eres de los segundos. Gracias por las charlas que se alargaban sin planearlo, por estar siempre presente y por apoyar siempre, sin necesidad de pedir nada a cambio. Si tuviera que apartar un espacio exclusivo entre tanto ruido, pantallas y proyectos, este rincón es el que guardo para ti: un lugar permanente para alguien que vale la pena. Gracias por la amistad, Take.\n\n— Matheo",
  "Одни проходят по экрану как очередное уведомление, а другие остаются, потому что по-настоящему меняют смысл дней. Ты из вторых. Спасибо за разговоры, которые затягивались сами собой, за то, что ты всегда рядом, и за то, что всегда поддерживаешь, ничего не прося взамен. Если бы мне нужно было выделить особое место среди столького шума, экранов и проектов, этот уголок я берегу для тебя: постоянное место для человека, который этого достоин. Спасибо за дружбу, Take.\n\n— Matheo",
  "Manche ziehen am Bildschirm vorbei wie eine weitere Benachrichtigung, und manche bleiben, weil sie den Tagen wirklich einen neuen Sinn geben. Du gehörst zu den Letzteren. Danke für die Gespräche, die sich ungeplant in die Länge zogen, dafür, dass du immer da bist, und dafür, dass du mich immer unterstützt, ohne je etwas zurückzuverlangen. Wenn ich zwischen all dem Lärm, den Bildschirmen und Projekten einen exklusiven Platz reservieren müsste, wäre diese Ecke der, den ich für dich aufbewahre: ein dauerhafter Ort für jemanden, der es wert ist. Danke für die Freundschaft, Take.\n\n— Matheo",
  "Il y a ceux qui traversent l’écran comme une notification de plus, et ceux qui restent parce qu’ils changent vraiment le sens des journées. Tu fais partie des seconds. Merci pour les discussions qui s’éternisaient sans que personne l’ait prévu, pour ta présence constante et pour ton soutien de toujours, sans jamais rien demander en retour. Si je devais réserver un espace exclusif au milieu de tant de bruit, d’écrans et de projets, ce petit coin est celui que je garde pour toi : un lieu permanent pour quelqu’un qui en vaut la peine. Merci pour l’amitié, Take.\n\n— Matheo"],
 placeholder:["Your message goes here.","Tu mensaje va aquí.","Ваше сообщение здесь.","Deine Nachricht kommt hierher.","Ton message va ici."],
 close:["Close","Cerrar","Закрыть","Schließen","Fermer"],
 secret:["Open the letter for iTake","Abrir la carta para iTake","Открыть письмо для iTake","Brief für iTake öffnen","Ouvrir la lettre pour iTake"],
 mute:["Mute music", "Silenciar música", "Отключить звук музыки", "Musik stummschalten", "Couper le son de la musique"],
 unmute:["Turn sound on", "Activar sonido", "Включить звук", "Ton einschalten", "Activer le son"],
 nothingPlaying:["nothing playing right now", "nada sonando ahora", "сейчас ничего не играет", "gerade wird nichts abgespielt", "rien en lecture pour le moment"],
 history:["recently played", "escuchado recientemente", "недавно прослушано", "zuletzt gehört", "écouté récemment"],
 prev:["Previous","Anterior","Назад","Zurück","Précédent"],
 next:["Next","Siguiente","Вперёд","Weiter","Suivant"],
 song:["Song","Canción","Песня","Titel","Titre"],
 duration:["Duration","Duración","Длительность","Dauer","Durée"],
 badges:["Badges","Insignias","Значки","Abzeichen","Badges"],
 b_staff:["Discord Staff","Personal de Discord","Сотрудник Discord","Discord-Mitarbeiter","Employé Discord"],
 b_partner:["Partnered Server Owner","Propietario de servidor asociado","Владелец партнёрского сервера","Partner-Server-Inhaber","Propriétaire de serveur partenaire"],
 b_hypesquadEvents:["HypeSquad Events","Eventos de HypeSquad","События HypeSquad","HypeSquad Events","Événements HypeSquad"],
 b_bugHunter1:["Bug Hunter","Cazador de errores","Охотник за багами","Bug-Jäger","Chasseur de bugs"],
 b_bugHunter2:["Bug Hunter (Gold)","Cazador de errores (oro)","Охотник за багами (золото)","Bug-Jäger (Gold)","Chasseur de bugs (or)"],
 b_hypesquadBravery:["HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery","HypeSquad Bravery"],
 b_hypesquadBrilliance:["HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance","HypeSquad Brilliance"],
 b_hypesquadBalance:["HypeSquad Balance","HypeSquad Balance","HypeSquad Balance","HypeSquad Balance","HypeSquad Balance"],
 b_earlySupporter:["Early Supporter","Seguidor temprano","Ранний сторонник","Früher Unterstützer","Soutien de la première heure"],
 b_verifiedDeveloper:["Early Verified Bot Developer","Desarrollador de bots verificado temprano","Ранний верифицированный разработчик ботов","Früher verifizierter Bot-Entwickler","Développeur de bots certifié de la première heure"],
 b_certifiedModerator:["Moderator Programs Alumni","Exalumno del programa de moderadores","Выпускник программы модераторов","Ehemaliger des Moderatorenprogramms","Ancien du programme de modération"],
 b_activeDeveloper:["Active Developer","Desarrollador activo","Активный разработчик","Aktiver Entwickler","Développeur actif"],
 historyEmpty:["no recent plays to show yet", "aún no hay reproducciones recientes que mostrar", "пока нет недавних прослушиваний", "noch keine zuletzt gehörten Titel", "aucune écoute récente à afficher pour le moment"],
 historyError:["recent plays are unavailable right now", "las reproducciones recientes no están disponibles ahora", "недавние прослушивания сейчас недоступны", "zuletzt Gehörtes ist gerade nicht verfügbar", "les écoutes récentes sont indisponibles pour le moment"],
 openSpotify:["Open in Spotify", "Abrir en Spotify", "Открыть в Spotify", "In Spotify öffnen", "Ouvrir dans Spotify"],
 loading:["loading", "cargando", "загрузка", "lädt", "chargement"],
 footer:["somewhere on the internet","en algún lugar de internet","где-то в интернете","irgendwo im Internet","quelque part sur internet"]
};
const $ = s => document.querySelector(s);
const store = { get: k => { try { return localStorage.getItem(k); } catch(e){ return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch(e){} } };
let lang = store.get("lang"); if (!LANGS.includes(lang)) lang = "en";
const tr = k => (T[k] || [])[LANGS.indexOf(lang)] || k;
function applyStaticText(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = tr(e.dataset.i18n));
  document.querySelectorAll("[data-i18n-label]").forEach(e => e.setAttribute("aria-label", tr(e.dataset.i18nLabel)));
  document.querySelectorAll("[data-i18n-title]").forEach(e => e.title = tr(e.dataset.i18nTitle));
}
applyStaticText();
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.12}) : null;
document.querySelectorAll(".rv").forEach(e => io ? io.observe(e) : e.classList.add("in"));
let conn = CONFIG.discordUserId ? "connecting" : "notConfigured", pres = null;
let apiNow = null, apiNowAt = 0;

function setText(el, t){ if (el.textContent === t) return; el.textContent = t; if (!el.dataset.rdy){ el.dataset.rdy = 1; return; } el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
let avBad = "", bannerBad = "", spT, histT, prof = null, profFails = 0, profT;
const TRACK_RE = /^[A-Za-z0-9]{22}$/;
function spotifyActivity(d){
  const a = d && Array.isArray(d.activities) ? d.activities.find(x => x && x.type === 2 && (x.id === "spotify:1" || x.name === "Spotify")) : null; if (!a || !a.details) return null;
  const img = String((a.assets && a.assets.large_image) || "").replace(/^spotify:/, "");
  return { song: a.details, artist: a.state || "", album: (a.assets && a.assets.large_text) || "", track_id: a.sync_id || "", album_art_url: /^[A-Za-z0-9]{20,}$/.test(img) ? "https://i.scdn.co/image/" + img : "", timestamps: a.timestamps || {} };
}
function spotifyOf(d){
  const s = (d && d.listening_to_spotify && d.spotify) || spotifyActivity(d); if (!s || typeof s !== "object" || !s.song) return null;
  const id = TRACK_RE.test(String(s.track_id || "")) ? s.track_id : "", st = +(s.timestamps && s.timestamps.start) || 0, en = +(s.timestamps && s.timestamps.end) || 0;
  return { id, title: String(s.song), artists: String(s.artist || "").split(";").map(x => x.trim()).filter(Boolean).join(", "), album: String(s.album || ""),
    cover: /^https:\/\//.test(s.album_art_url || "") ? s.album_art_url : "", url: id ? "https://open.spotify.com/track/" + id : "", startMs: st, endMs: en > st ? en : 0 };
}
const safeUrl = u => /^https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\//.test(u || "") ? u : "";
let favSrc = "";
function setFavicon(u){ if (!u || u === favSrc) return; favSrc = u;
  const put = h => { try { const l = $("#favicon"); l.setAttribute("href", h); l.removeAttribute("type"); } catch(e){} };
  put(u);
  if (typeof Image === "undefined") return;
  try { const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => { try { const c = document.createElement("canvas"), n = 128, r = 30; c.width = c.height = n; const x = c.getContext("2d");
      x.beginPath(); x.moveTo(r, 0); x.arcTo(n, 0, n, n, r); x.arcTo(n, n, 0, n, r); x.arcTo(0, n, 0, 0, r); x.arcTo(0, 0, n, 0, r); x.closePath(); x.clip(); x.drawImage(im, 0, 0, n, n);
      if (favSrc === u) put(c.toDataURL("image/png")); } catch(e){} };
    im.src = u.replace(/size=\d+/, "size=128"); } catch(e){} }
function renderBanner(){
  const box = $("#banner"), img = $("#banner-img"), b = prof && prof.banner;
  const src = b ? safeUrl(still ? b.staticUrl : b.url) : "", acc = prof && /^#[0-9a-f]{6}$/i.test(prof.accentColor || "") ? prof.accentColor : "";
  box.style.setProperty("--acc", acc);
  box.dataset.acc = !src && acc ? "1" : "0";
  if (src && src !== bannerBad){ if (img.getAttribute("src") !== src) img.src = src; img.hidden = false; box.dataset.has = "1"; } else { img.hidden = true; box.dataset.has = "0"; }
}
function bioText(){
  const raw = (pres && pres.kv && pres.kv.bio) || (prof && prof.bio) || ""; if (typeof raw !== "string") return "";
  return raw.replace(/\\n/g, "\n").replace(/\r\n?/g, "\n").trim().slice(0, 600);
}
function bioNodes(t){
  const out = [], re = /(\*\*[^*\n]+\*\*|~~[^~\n]+~~|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_)/g; let last = 0, m;
  const add = (tag, txt) => { const e = document.createElement(tag); e.textContent = txt; out.push(e); };
  while ((m = re.exec(t))){ if (m.index > last) out.push(t.slice(last, m.index)); const x = m[0];
    if (x.startsWith("**")) add("b", x.slice(2, -2)); else if (x.startsWith("~~")) add("s", x.slice(2, -2)); else if (x[0] === "`") add("code", x.slice(1, -1)); else add("i", x.slice(1, -1)); last = m.index + x.length; }
  if (last < t.length) out.push(t.slice(last)); return out;
}
let bioKey = "";
function renderBio(){
  const el = $("#bio"), t = bioText(); el.hidden = !t; if (t === bioKey) return; bioKey = t;
  el.replaceChildren(...(t ? bioNodes(t) : []));
}
function renderBadges(){
  const list = (prof && Array.isArray(prof.badges) ? prof.badges : []).filter(k => T["b_" + k]), ul = $("#badges");
  ul.hidden = !list.length; ul.setAttribute("aria-label", tr("badges"));
  ul.replaceChildren(...list.map(k => { const li = document.createElement("li"); li.textContent = tr("b_" + k); return li; }));
}
function renderPresence(){
  setText($("#conn-text"), tr(conn)); $("#conn-dot").dataset.s = conn; $("#discord").dataset.c = conn;
  const d = pres, u = (d && d.discord_user) || {}, st = d ? d.discord_status : "offline";
  $("#st-dot").dataset.s = st;
  setText($("#status"), d ? tr(st) : tr(conn === "live" ? "offline" : conn));
  const nm = d ? (u.global_name || u.display_name || u.username || (prof && prof.displayName) || "—") : (prof && prof.displayName) || "—"; setText($("#name"), nm);
  const uname = (d && u.username) || (prof && prof.username) || "", un = uname && uname !== nm ? "@" + uname : ""; setText($("#uname"), un); $("#uname").hidden = !un;
  const acts = d ? d.activities || [] : [];
  const cs = acts.find(a => a.type === 4), csTxt = cs ? [(cs.emoji && !cs.emoji.id && cs.emoji.name) || "", cs.state || ""].filter(Boolean).join(" ") : "";
  setText($("#custom"), csTxt); $("#custom").hidden = !csTxt;
  const act = acts.find(a => a.type !== 4 && a.id !== "spotify:1" && a.name !== "Spotify");
  const song = currentSong();
  const iconOnly = !!(d && !act && song);
  setText($("#activity"), iconOnly ? "" : !d ? (conn === "unavailable" ? tr("hint") : "") : act ? act.name + (act.details ? " — " + act.details : "") : tr("noActivity"));
  $("#activity").style.display = iconOnly ? "none" : ""; $("#act-sp").hidden = !iconOnly;
  const lanyardAv = d && u.id && u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "";
  const av = $("#av"), src = safeUrl(prof && (still ? prof.avatarStatic : prof.avatar)) || lanyardAv;
  if (src && src !== avBad){ if (av.getAttribute("src") !== src) av.src = src; av.hidden = false; $("#av-fb").hidden = true; } else { av.hidden = true; $("#av-fb").hidden = false; }
  if (src && src !== avBad) setFavicon(prof && prof.avatarStatic ? safeUrl(prof.avatarStatic) || src : src);
  const dec = safeUrl((prof && prof.decoration) || (u.avatar_decoration_data && u.avatar_decoration_data.asset ? `https://cdn.discordapp.com/avatar-decoration-presets/${u.avatar_decoration_data.asset}.png?size=160&passthrough=true` : "")), de = $("#av-deco");
  if (dec){ if (de.getAttribute("src") !== dec) de.src = dec; de.hidden = false; } else de.hidden = true;
  renderBanner(); renderBio(); renderBadges(); renderSpotify();
}
let lastSpId = null;
function currentSong(){ return spotifyOf(pres) || (apiNow && Date.now() - apiNowAt < 90000 ? apiNow : null); }
function renderSpotify(){
  const t = currentSong(), s = t ? "playing" : !pres ? (conn === "unavailable" ? "error" : "loading") : "idle", live = s === "playing", box = $("#spotify"), song = $("#sp-song"), img = $("#sp-art");
  box.classList.toggle("idle", !live); box.classList.toggle("playing", live); box.dataset.s = s;
  setText($("#sp-label"), live ? tr("listening") : s === "idle" ? tr("nothingPlaying") : s === "error" ? "Spotify · " + tr("unavailable") : tr("loading"));
  setText(song, live ? t.title : ""); if (live && t.url) song.href = t.url; else song.removeAttribute("href");
  setText($("#sp-artist"), live ? t.artists : ""); setText($("#sp-album"), live ? t.album : "");
  const art = live && t.cover; img.style.display = art ? "" : "none"; if (art && img.getAttribute("src") !== art) img.src = art;
  const sid = live ? (t.id || t.title) : null; if (sid && sid !== lastSpId){ setTimeout(loadHistory, 2500); } lastSpId = sid;
  clearInterval(spT); const pr = $(".sp-prog"), dur = live ? t.endMs - t.startMs : 0, ok = live && t.startMs > 0 && dur > 0; pr.hidden = !ok; if (!ok) return;
  const upd = () => { const el = Math.min(Math.max(Date.now() - t.startMs, 0), dur);
    $("#sp-cur").textContent = fmt(el / 1000); $("#sp-dur").textContent = fmt(dur / 1000); $("#sp-bar").style.transform = `scaleX(${el / dur})`; if (el >= dur) clearInterval(spT); };
  upd(); spT = setInterval(upd, 1000);
}
async function loadProfile(){
  clearTimeout(profT); if (stopped) return;
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 10000); let next = 60000;
  try { const r = await fetch("/api/profile", { signal: ctl.signal, headers: { Accept: "application/json" } }); if (!r.ok) throw 0; const j = await r.json(); if (!j || !j.id) throw 0; prof = j; profFails = 0; renderPresence(); }
  catch(e){ profFails++; next = Math.min(60000, 15000 * Math.pow(2, profFails)); }
  finally { clearTimeout(to); profT = setTimeout(loadProfile, document.hidden ? 300000 : next); }
}
let ws, hb, rt, wt, tries = 0, everLive = false, stopped = false;
function connect(){
  if (!CONFIG.discordUserId || stopped || (ws && ws.readyState < 2)) return;
  clearTimeout(rt); clearTimeout(wt);
  if (everLive) conn = "reconnecting"; else if (!tries) conn = "connecting";
  renderPresence();
  let s;
  try { s = ws = new WebSocket("wss://api.lanyard.rest/socket"); } catch(e){ return retry(); }
  wt = setTimeout(() => { if (conn !== "live"){ conn = pres ? "reconnecting" : "unavailable"; renderPresence(); } }, 10000);
  s.onmessage = e => { if (s !== ws) return; let m; try { m = JSON.parse(e.data); } catch(_){ return; }
    if (m.op === 1){ clearInterval(hb); hb = setInterval(() => s.readyState === 1 && s.send('{"op":3}'), m.d.heartbeat_interval);
      s.send(JSON.stringify({ op:2, d:{ subscribe_to_id: CONFIG.discordUserId } })); }
    if (m.op === 0 && m.d && m.d.discord_user){ clearTimeout(wt); pres = m.d; conn = "live"; everLive = true; tries = 0; renderPresence(); } };
  s.onclose = () => { if (s !== ws || stopped) return; clearInterval(hb); clearTimeout(wt); retry(); };
  s.onerror = () => s.close();
}
function retry(){ conn = everLive ? "reconnecting" : "unavailable"; renderPresence(); clearTimeout(rt); rt = setTimeout(connect, Math.min(30000, 2000 * ++tries)); }
addEventListener("online", () => { tries = 0; connect(); loadHistory(); loadProfile(); });
addEventListener("pagehide", () => { clearInterval(spT); clearInterval(histT); clearTimeout(profT); stopped = true; clearTimeout(rt); clearTimeout(wt); clearInterval(hb); if (ws) ws.close(); });
addEventListener("pageshow", e => { if (e.persisted){ stopped = false; tries = 0; connect(); startHistory(); loadProfile(); } });
$("#sp-art").onerror = e => e.target.style.display = "none";
$("#banner-img").onerror = e => { bannerBad = e.target.getAttribute("src"); renderBanner(); };
$("#av").onerror = e => { avBad = e.target.getAttribute("src"); e.target.hidden = true; $("#av-fb").hidden = false; };

const fmt = n => isFinite(n) ? Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0") : "0:00";

let ttT;
$("#theme").onclick = () => { const h = document.documentElement, n = h.dataset.theme === "dark" ? "light" : "dark";
  clearTimeout(ttT); h.classList.add("tt"); h.dataset.theme = n; ttT = setTimeout(() => h.classList.remove("tt"), 280);
  try { localStorage.setItem("theme", n); } catch(e){} metaTheme(); };
const metaTheme = () => $("meta[name=theme-color]").content = document.documentElement.dataset.theme === "dark" ? "#080808" : "#F6F5F2";
const lw = $("#langwrap"), lb = $("#lang"), lm = $("#lang-menu"), lo = [...lm.children]; let act = 0;
function syncLang(){ $("#lang-cur").textContent = lang.toUpperCase(); lo.forEach(o => o.setAttribute("aria-selected", o.dataset.lang === lang)); }
function setLang(c){ if (!LANGS.includes(c)) return; lang = c; try { localStorage.setItem("lang", lang); } catch(e){} applyLang(); }
function mark(i){ act = (i + lo.length) % lo.length; lo.forEach((o, j) => o.classList.toggle("act", j === act)); lm.setAttribute("aria-activedescendant", lo[act].id); }
function openLang(){ lw.classList.add("open"); lb.setAttribute("aria-expanded", "true"); lm.style.left = lm.style.right = "";
  const r = lm.getBoundingClientRect(); if (r.left < 8){ lm.style.left = "0"; lm.style.right = "auto"; }
  mark(LANGS.indexOf(lang)); lm.focus({preventScroll:true}); }
function closeLang(back){ if (!lw.classList.contains("open")) return; lw.classList.remove("open"); lb.setAttribute("aria-expanded", "false"); if (back) lb.focus(); }
lb.onclick = () => lw.classList.contains("open") ? closeLang(true) : openLang();
lb.addEventListener("keydown", e => { if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); openLang(); } });
lo.forEach(o => o.addEventListener("click", () => { setLang(o.dataset.lang); closeLang(true); }));
lm.addEventListener("keydown", e => { const k = e.key;
  if (k === "ArrowDown") mark(act + 1); else if (k === "ArrowUp") mark(act - 1); else if (k === "Home") mark(0); else if (k === "End") mark(lo.length - 1);
  else if (k === "Enter" || k === " "){ setLang(lo[act].dataset.lang); closeLang(true); }
  else if (k === "Escape"){ e.stopPropagation(); closeLang(true); } else if (k === "Tab"){ closeLang(false); return; } else return;
  e.preventDefault(); });
document.addEventListener("pointerdown", e => { if (!lw.contains(e.target)) closeLang(false); });
lm.addEventListener("focusout", e => { if (!lw.contains(e.relatedTarget)) closeLang(false); });
function applyLang(){
  syncLang(); applyStaticText();
  $("#l-body").textContent = CONFIG.dedicationMessage || tr("dedication");
  renderPresence(); renderHistoryState();
}
const dlg = $("#letter");
$("#secret").onclick = e => { const b = e.currentTarget; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); dlg.showModal(); vidPlay(); }; $("#close").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
const vid = $("#l-vid") || document.createElement("video");
vid.onerror = () => dlg.classList.add("no-gif"); vid.onloadeddata = () => dlg.classList.remove("no-gif");
const vidPlay = () => { try { const p = vid.play && vid.play(); if (p && p.catch) p.catch(() => {}); } catch(e){} }, vidStop = () => { try { vid.pause && vid.pause(); } catch(e){} };
dlg.addEventListener("close", vidStop);

const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const layers = [{n:34,s:[1,1.5],k:.015,d:160},{n:22,s:[1.5,2.2],k:.04,d:110},{n:9,s:[2.4,3.4],k:.09,d:80}].map(L => {
  const l = document.createElement("div"), d = document.createElement("div"); l.className = "sl"; d.className = "sd"; d.style.setProperty("--dd", L.d + "s"); l.appendChild(d);
  for (let i = 0; i < L.n; i++){ const e = document.createElement("i"), z = L.s[0] + Math.random() * (L.s[1] - L.s[0]);
    e.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;opacity:${.25+Math.random()*.65}`;
    if (Math.random() < .45 && !still){ e.className = "t"; e.style.setProperty("--t", 3 + Math.random() * 6 + "s"); e.style.setProperty("--dl", -Math.random() * 8 + "s"); }
    d.appendChild(e); }
  $("#stars").appendChild(l); return { l, k: L.k };
});
let mx = 0, raf = 0;
const par = () => { raf = 0; layers.forEach(({l, k}) => l.style.transform = `translate3d(${-mx*k*80}px,${-scrollY*k}px,0)`); };
const req = () => raf || (raf = requestAnimationFrame(par));
if (!still){ addEventListener("scroll", req, {passive:true});
  addEventListener("pointermove", e => { if (e.pointerType === "mouse"){ mx = e.clientX / innerWidth - .5; req(); } }, {passive:true}); }
if (still) document.querySelectorAll("animateMotion").forEach(a => a.remove());
document.addEventListener("visibilitychange", () => { const h = document.hidden; document.documentElement.classList.toggle("paused", h); document.querySelectorAll("svg").forEach(v => h ? v.pauseAnimations() : v.unpauseAnimations()); });
try { localStorage.setItem("seen", "1"); } catch(e){}
const hist = $("#hist"), histSec = $("#history"), histMsg = $("#hist-msg"), dots = $("#car-dots"), cPrev = $("#car-prev"), cNext = $("#car-next"); let histKey = "", histState = "loading", histBusy = false, cur = 0;
const cards = () => [...hist.children];
function carState(){
  const c = cards(), n = c.length; if (!n){ cPrev.disabled = cNext.disabled = true; return; }
  cur = ((cur % n) + n) % n;
  c.forEach((li, i) => { let o = i - cur; if (o > n / 2) o -= n; else if (o < -n / 2) o += n;
    li.dataset.o = String(Math.max(-3, Math.min(3, o))); li.setAttribute("aria-current", o === 0 ? "true" : "false"); if (li.children[0]) li.children[0].tabIndex = o === 0 ? 0 : -1; });
  cPrev.disabled = cNext.disabled = n < 2;
  [...dots.children].forEach((d, i) => d.setAttribute("aria-current", i === cur ? "true" : "false"));
}
function goTo(i){ if (!cards().length) return; cur = i; carState(); }
function page(dir){ goTo(cur + dir); }
cPrev.onclick = () => page(-1); cNext.onclick = () => page(1);
hist.addEventListener("keydown", e => { if (e.key === "ArrowRight"){ e.preventDefault(); page(1); } else if (e.key === "ArrowLeft"){ e.preventDefault(); page(-1); } });
let px = null, dragged = false;
hist.addEventListener("pointerdown", e => { px = e.clientX; dragged = false; });
hist.addEventListener("pointercancel", () => { px = null; });
hist.addEventListener("pointerup", e => { if (px === null) return; const dx = e.clientX - px; px = null; if (Math.abs(dx) > 40){ dragged = true; page(dx < 0 ? 1 : -1); setTimeout(() => { dragged = false; }, 60); } });
hist.addEventListener("click", e => {
  if (dragged){ e.preventDefault(); return; }
  const li = e.target && e.target.closest ? e.target.closest("li") : null;
  if (li && li.dataset.o !== "0"){ e.preventDefault(); const k = cards().indexOf(li); if (k >= 0) goTo(k); }
});
function renderHistoryState(){
  const m = histState === "ok" ? "" : tr(histState === "loading" ? "loading" : histState === "empty" ? "historyEmpty" : "historyError");
  histMsg.textContent = m; histMsg.hidden = !m; hist.hidden = histState !== "ok"; dots.hidden = histState !== "ok" || cards().length < 2; histSec.hidden = false; histSec.dataset.s = histState;
  $("#car-prev").parentNode.hidden = histState !== "ok"; carState();
}
function histCard(i){
  const li = document.createElement("li"), a = document.createElement("a"), cv = document.createElement("div"), t = document.createElement("strong"), r = document.createElement("span"), m = document.createElement("span");
  if (i.url){ a.href = i.url; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("data-i18n-title", "openSpotify"); a.title = tr("openSpotify"); }
  cv.className = "cv";
  if (/^https:\/\//.test(i.cover || "")){ const im = document.createElement("img"); im.src = i.cover; im.alt = ""; im.width = im.height = 300; im.loading = "lazy"; im.decoding = "async"; im.onerror = () => { im.remove(); cv.classList.add("ph"); }; cv.appendChild(im); } else cv.classList.add("ph");
  t.textContent = i.title; r.className = "ar"; r.textContent = i.artists || "";
  m.className = "mt"; const ms = +i.durationMs, d = isFinite(ms) && ms >= 1000 && ms <= 6 * 3600e3 ? fmt(ms / 1000) : "", al = typeof i.album === "string" ? i.album : "";
  if (d){ const ds = document.createElement("b"); ds.textContent = d; ds.setAttribute("data-i18n-title", "duration"); ds.title = tr("duration"); m.appendChild(ds); }
  if (al){ const alb = document.createElement("em"); alb.textContent = al; m.appendChild(alb); }
  m.hidden = !d && !al;
  a.append(cv, t, r, m); li.appendChild(a); return li;
}
function renderHistory(items){
  histState = items.length ? "ok" : "empty";
  const key = items.map(i => i.id + "@" + (i.playedAt || "")).join(",");
  if (key !== histKey){ histKey = key;
    hist.replaceChildren(...items.map(histCard));
    dots.replaceChildren(...items.map((_, k) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", tr("song") + " " + (k + 1)); b.onclick = () => goTo(k); return b; }));
    cur = 0; }
  renderHistoryState();
}
async function loadHistory(){ if (document.hidden || histBusy) return; histBusy = true;
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 12000);
  try { const r = await fetch("/api/recent", { signal: ctl.signal, headers: { Accept: "application/json" } }); if (!r.ok) throw 0; const j = await r.json();
    if (!j || !Array.isArray(j.items)) throw 0;
    renderHistory(j.items.filter(i => i && i.title && (!i.url || /^https:\/\/open\.spotify\.com\//.test(i.url))).slice(0, 10));
    const n = j.now; apiNow = n && typeof n === "object" && n.title && (!n.url || /^https:\/\/open\.spotify\.com\//.test(n.url)) ? { id: "", title: String(n.title), artists: String(n.artists || ""), album: String(n.album || ""), cover: /^https:\/\//.test(n.cover || "") ? n.cover : "", url: n.url || "", startMs: 0, endMs: 0 } : null; apiNowAt = Date.now(); renderPresence();
  } catch(e){ if (histState !== "ok"){ histState = "error"; renderHistoryState(); }  }
  finally { clearTimeout(to); histBusy = false; } }
document.addEventListener("visibilitychange", () => { if (!document.hidden){ if (histState !== "ok") loadHistory(); else startHistory(); loadProfile(); } });
const startHistory = () => { clearInterval(histT); loadHistory(); histT = setInterval(loadHistory, 15000); };
renderHistoryState(); startHistory(); loadProfile();
[metaTheme, applyLang, connect].forEach(f => { try { f(); } catch(e){ console.error(e); } });

if (typeof IntersectionObserver !== "undefined") {
  const links = [...document.querySelectorAll("nav a")];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.toggleAttribute("aria-current", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["home", "about", "history"].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  [["#home", ".orbit"], ["#about", ".geo"]].forEach(([k, v]) => { const sec = document.querySelector(k), svg = document.querySelector(v); if (sec && svg && svg.pauseAnimations) new IntersectionObserver(([e]) => e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()).observe(sec); });
}
