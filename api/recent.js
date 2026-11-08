const { sendJson, allowGet, sendError } = require("./_lib/http");
const { sync } = require("./_lib/sync");
const { publicItems } = require("./_lib/history");

module.exports = async (req, res) => {
  if (!allowGet(req, res)) return;
  try {
    const r = await sync();
    sendJson(res, 200, { items: publicItems(r.items), live: r.live, now: r.now || null }, "public, s-maxage=8, stale-while-revalidate=20");
  } catch (e) { sendError(res, e, "api/recent"); }
};
