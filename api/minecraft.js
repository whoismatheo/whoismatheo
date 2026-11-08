const { sendJson, allowGet } = require("./_lib/http");

const NAME = "sxhq";
const TEX = /^https?:\/\/textures\.minecraft\.net\//;
const HOST = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(:\d{1,5})?$/i;
let memo = null;

const getJson = async url => {
  const r = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { accept: "application/json" } });
  if (!r.ok) throw Object.assign(new Error("http " + r.status), { status: r.status });
  return r.json();
};
const dataUri = async url => {
  const r = await fetch(url.replace(/^http:/, "https:"), { signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error("texture " + r.status);
  return "data:image/png;base64," + Buffer.from(await r.arrayBuffer()).toString("base64");
};
const dashed = h => h.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");

const serverRecord = () => {
  const address = (process.env.MC_SERVER_ADDRESS || "").trim(), name = (process.env.MC_SERVER_NAME || "").trim(), seen = (process.env.MC_SERVER_DATE || "").trim();
  if (!name && !address) return null;
  if (address && !HOST.test(address)) return null;
  return { name: name || address, address: address || null, seen: /^\d{4}-\d{2}-\d{2}/.test(seen) ? seen : null, icon: address ? "https://api.mcsrvstat.us/icon/" + address : null, source: "manual" };
};

async function profile() {
  if (memo && Date.now() - memo.t < 600000) return memo.v;
  let p;
  try { p = await getJson("https://api.minecraftservices.com/minecraft/profile/lookup/name/" + NAME); }
  catch (e) { if (e.status === 404) throw e; p = await getJson("https://api.mojang.com/users/profiles/minecraft/" + NAME); }
  const s = await getJson("https://sessionserver.mojang.com/session/minecraft/profile/" + p.id);
  const prop = (s.properties || []).find(x => x.name === "textures");
  const tex = prop ? (JSON.parse(Buffer.from(prop.value, "base64").toString("utf8")).textures || {}) : {};
  const skin = tex.SKIN && TEX.test(tex.SKIN.url) ? tex.SKIN : null;
  const cape = tex.CAPE && TEX.test(tex.CAPE.url) ? tex.CAPE : null;
  const [skinData, capeData] = await Promise.all([skin ? dataUri(skin.url) : null, cape ? dataUri(cape.url) : null]);
  const v = {
    name: s.name || p.name, uuid: dashed(p.id), edition: "java",
    skin: skin ? { data: skinData, model: skin.metadata && skin.metadata.model === "slim" ? "slim" : "default" } : null,
    capes: cape ? [{ id: cape.url.split("/").pop(), data: capeData, active: true }] : [],
    server: serverRecord()
  };
  memo = { t: Date.now(), v };
  return v;
}

module.exports = async (req, res) => {
  if (!allowGet(req, res)) return;
  try { sendJson(res, 200, await profile(), "public, s-maxage=600, stale-while-revalidate=3600"); }
  catch (e) {
    if (memo) return sendJson(res, 200, memo.v, "public, s-maxage=60");
    sendJson(res, e.status === 429 ? 429 : 503, { error: "unavailable" }, "public, s-maxage=30");
  }
};
