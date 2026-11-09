const { sendJson, allowGet } = require("./_lib/http");

const NAME = "sxhq";
const TEX = /^https?:\/\/textures\.minecraft\.net\//;
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

const FAVORITE = { name: "Miami Practice", address: "miamiprac.com", icon: "https://api.mcsrvstat.us/icon/miamiprac.com" };
const OWNED = [
  { id: "28de4a81688ad18b49e735a273e086c18f1e3966956123ccb574034c06f5d336", label: "pan" },
  { id: "5ec930cdd2629c8771655c60eebeb867b4b6559b0e6d3bc71c40c96347fa03f0", label: "common" }
];

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
  const equipped = cape ? cape.url.split("/").pop() : null;
  const ids = [...(equipped && !OWNED.some(c => c.id === equipped) ? [{ id: equipped, label: "equipped" }] : []), ...OWNED];
  const [skinData, ...capeData] = await Promise.all([skin ? dataUri(skin.url) : null, ...ids.map(c => dataUri("https://textures.minecraft.net/texture/" + c.id).catch(() => null))]);
  const v = {
    name: s.name || p.name, uuid: dashed(p.id), edition: "java",
    skin: skin ? { data: skinData, model: skin.metadata && skin.metadata.model === "slim" ? "slim" : "default" } : null,
    capes: ids.map((c, i) => ({ id: c.id, label: c.label, data: capeData[i], active: c.id === equipped })).filter(c => c.data),
    server: { ...FAVORITE, source: "favorite" }
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
