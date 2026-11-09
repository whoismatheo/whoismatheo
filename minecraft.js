(() => {
  const root = document.getElementById("minecraft");
  if (!root) return;
  const $ = s => root.querySelector(s);
  const LIB = "https://cdn.jsdelivr.net/npm/skinview3d@3.1.0/bundles/skinview3d.bundle.js";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  let viewer = null, data = null, started = false;

  const state = t => { $("#mc-state").textContent = t; };
  const note = t => { const m = $("#mc-msg"); m.textContent = t; m.hidden = !t; };

  const load = async () => {
    try { const c = JSON.parse(sessionStorage.getItem("mc3") || "null"); if (c && Date.now() - c.t < 6e5) return c.v; } catch (e) {}
    const r = await fetch("/api/minecraft");
    if (!r.ok) throw new Error("http " + r.status);
    const v = await r.json();
    try { sessionStorage.setItem("mc3", JSON.stringify({ t: Date.now(), v })); } catch (e) {}
    return v;
  };
  const lib = () => window.skinview3d ? Promise.resolve() : new Promise((ok, no) => { const s = el("script"); s.src = LIB; s.onload = ok; s.onerror = no; document.head.appendChild(s); });

  const face = src => new Promise(ok => {
    const im = new Image();
    im.onload = () => { const k = im.width / 64, c = el("canvas"); c.width = 10; c.height = 16; c.getContext("2d").drawImage(im, k, k, 10 * k, 16 * k, 0, 0, 10, 16); ok(c.toDataURL()); };
    im.onerror = () => ok(src);
    im.src = src;
  });

  const info = d => {
    $("#mc-name").textContent = d.name;
    $("#mc-uuid").textContent = d.uuid;
    $("#mc-model").textContent = d.skin ? (d.skin.model === "slim" ? "alex · slim arms" : "steve · classic arms") : "unavailable";
  };

  const copy = () => {
    const b = $("#mc-copy");
    const done = t => { b.textContent = t; setTimeout(() => { b.textContent = "copy"; }, 1400); };
    navigator.clipboard.writeText(data.uuid).then(() => done("copied"), () => done("failed"));
  };

  const capes = async d => {
    const box = $("#mc-capes");
    box.replaceChildren();
    if (!d.capes.length) { box.appendChild(el("p", "mc-none mono", "no official capes on this account")); return; }
    const mk = (label, img, apply) => {
      const b = el("button", "mc-cape"); b.type = "button"; b.title = label; b.setAttribute("aria-label", label); b.setAttribute("aria-pressed", "false");
      if (img) { const i = el("img"); i.src = img; i.alt = ""; i.width = 10; i.height = 16; b.appendChild(i); } else b.appendChild(el("span", "mc-x", "∅"));
      b.onclick = async () => { box.querySelectorAll(".mc-cape").forEach(x => x.setAttribute("aria-pressed", String(x === b))); if (!viewer) return; try { await apply(); } catch (e) {} previews(); };
      box.appendChild(b); return b;
    };
    const none = mk("no cape", null, () => viewer.resetCape());
    const faces = await Promise.all(d.capes.map(c => face(c.data)));
    const made = d.capes.map((c, i) => mk((c.label && c.label !== "equipped" ? c.label + " cape" : "official cape") + (c.active ? " (equipped)" : ""), faces[i], () => viewer.loadCape(c.data)));
    (made.find((_, i) => d.capes[i].active) || none).setAttribute("aria-pressed", "true");
  };

  const server = s => {
    const box = $("#mc-server");
    box.replaceChildren();
    if (!s) { box.appendChild(el("p", "mc-none mono", "no favorite server set"));  return; }
    if (s.icon) { const i = el("img", "mc-icon"); i.src = s.icon; i.alt = ""; i.width = 48; i.height = 48; i.onerror = () => i.remove(); box.appendChild(i); }
    const t = el("div", "mc-srv-t");
    t.appendChild(el("strong", "", s.name));
    if (s.address) t.appendChild(el("span", "mono", s.address));
    t.appendChild(el("span", "mc-sub mono", "favorite server"));
    box.appendChild(t);
  };

  const previews = () => {
    if (!viewer) return;
    const box = $("#mc-prev");
    box.replaceChildren();
    const keep = viewer.autoRotate, y = viewer.playerWrapper.rotation.y;
    viewer.autoRotate = false;
    ["front", "side", "back", "side"].forEach((lbl, i) => {
      viewer.playerWrapper.rotation.y = i * Math.PI / 2;
      viewer.render();
      const c = el("canvas"), src = viewer.canvas, w = 96, h = Math.round(96 * src.height / src.width);
      c.width = w; c.height = h; c.getContext("2d").drawImage(src, 0, 0, w, h);
      const f = el("figure", "mc-shot"); const im = el("img"); im.src = c.toDataURL(); im.alt = lbl + " view"; f.append(im, el("figcaption", "mono", lbl));
      box.appendChild(f);
    });
    viewer.playerWrapper.rotation.y = y;
    viewer.autoRotate = keep;
  };

  const view = async () => {
    const cv = $("#mc-canvas"), host = cv.parentElement, opts = { canvas: cv, width: host.clientWidth, height: host.clientHeight, zoom: .72, fov: 38 };
    viewer = new skinview3d.SkinViewer(opts);
    viewer.controls.enableZoom = false;
    viewer.controls.enablePan = false;
    viewer.autoRotate = !calm;
    viewer.autoRotateSpeed = .7;
    if (!calm) viewer.animation = new skinview3d.IdleAnimation();
    await viewer.loadSkin(data.skin.data, { model: data.skin.model });
    const eq = data.capes.find(c => c.active);
    if (eq) await viewer.loadCape(eq.data);
    new ResizeObserver(() => { if (host.clientWidth) viewer.setSize(host.clientWidth, host.clientHeight); }).observe(host);
    new IntersectionObserver(([e]) => { viewer.renderPaused = !e.isIntersecting; }).observe(host);
    addEventListener("pagehide", () => viewer.dispose());
    const rot = $("#mc-rot");
    const paint = () => { rot.textContent = viewer.autoRotate ? "pause" : "rotate"; rot.setAttribute("aria-pressed", String(!viewer.autoRotate)); };
    rot.onclick = () => { viewer.autoRotate = !viewer.autoRotate; paint(); };
    rot.hidden = false;
    paint();
    previews();
  };

  const start = async () => {
    if (started) return;
    started = true;
    state("loading");
    let d;
    try { d = await load(); } catch (e) { state("unavailable"); note("minecraft profile unavailable right now"); return; }
    data = d;
    info(d); server(d.server); capes(d); $("#mc-copy").onclick = copy;
    if (!d.skin) { state("online"); note("no skin texture on this account"); return; }
    try { await lib(); await view(); state("online"); note(""); }
    catch (e) { state("online"); note("3d viewer unavailable on this device"); }
  };

  if ("IntersectionObserver" in window) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); start(); } }, { rootMargin: "500px 0px" }).observe(root);
  else start();
})();
