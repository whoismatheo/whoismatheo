(function () {
  var root = document.documentElement, KEY = "entered", entered = false;
  try { entered = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  root.dataset.entry = entered ? "open" : "locked";
  var tiers = [/[^.:,\n]/g, /[^\-=+*\/\\|\n]/g, /[^#%8&@\n]/g], ramp = "@&8%#*+=,:. ";
  function ms(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    if (/ms$/.test(v)) return parseFloat(v);
    if (/s$/.test(v)) return parseFloat(v) * 1000;
    return fallback;
  }
  function trim(list) {
    var minC = 1e9, maxC = -1, minR = 1e9, maxR = -1, split = list.map(function (f) { return f.split("\n"); });
    split.forEach(function (rows) {
      rows.forEach(function (row, y) {
        var a = row.search(/\S/), b = row.replace(/\s+$/, "").length - 1;
        if (a < 0) return;
        if (a < minC) minC = a; if (b > maxC) maxC = b; if (y < minR) minR = y; if (y > maxR) maxR = y;
      });
    });
    if (maxC < 0) return list;
    var w = maxC - minC + 1, h = maxR - minR + 1;
    box = { cols: w, rows: h };
    return split.map(function (rows) {
      var out = [], y;
      for (y = minR; y <= maxR; y++) { var r = (rows[y] || "").slice(minC, maxC + 1); out.push(r.length < w ? r + new Array(w - r.length + 1).join(" ") : r); }
      return out.join("\n");
    });
  }
  var box = null;
  function init() {
    var screen = document.getElementById("entry"), btn = screen && screen.querySelector(".entry-btn");
    var stage = screen && screen.querySelector(".zp-stage"), art = window.ZP;
    if (!screen || !btn || !stage || !art || !art.frames.length) { root.dataset.entry = "open"; if (screen) screen.remove(); return; }
    if (root.dataset.entry === "open") { screen.remove(); return; }
    var layers = stage.querySelectorAll(".zp-l"), frames = trim(art.frames), gated = document.querySelectorAll(".nav, main, footer");
    var shift = frames.map(function (f) {
      var lo = 1e9, hi = -1, w = frames[0].split("\n")[0].length;
      f.split("\n").forEach(function (r) { var a = r.search(/\S/); if (a < 0) return; if (a < lo) lo = a; var b = r.replace(/\s+$/, "").length - 1; if (b > hi) hi = b; });
      return hi < 0 ? 0 : (w - 1) / 2 - (lo + hi) / 2;
    });
    function place(i0, f) {
      var a = shift[i0], b = shift[Math.min(shift.length - 1, i0 + 1)], cw = stage.offsetWidth / dims().cols;
      stage.style.transform = "translate3d(" + ((a + (b - a) * f) * cw).toFixed(2) + "px,0,0)";
    }
    var calm = matchMedia("(prefers-reduced-motion: reduce)").matches, started = false;
    function dims() { return box || art; }
    function pad(text) {
      var rows = text.split("\n"), out = [], y;
      for (y = 0; y < dims().rows; y++) { var r = rows[y] || ""; out.push(r.length < dims().cols ? r + new Array(dims().cols - r.length + 1).join(" ") : r); }
      return out.join("\n");
    }
    function draw(text) { text = pad(text); for (var i = 0; i < layers.length; i++) layers[i].textContent = text.replace(tiers[i], " "); }
    function fit() {
      var fs = Math.max(4.5, Math.min((innerWidth - 28) / (art.cols * .6), innerHeight * .6 / art.rows, 16));
      screen.style.setProperty("--fs", fs.toFixed(2) + "px");
    }
    function close(dur, done) {
      var t0 = performance.now(), n = frames.length, last = -1;
      (function step(now) {
        var k = Math.max(0, Math.min(1, (now - t0) / dur)), i = Math.min(n - 1, Math.floor(k * n)), q = k * (n - 1);
        if (i !== last) { draw(frames[i]); last = i; }
        place(Math.min(n - 1, Math.floor(q)), q - Math.floor(q));
        if (k < 1) requestAnimationFrame(step); else done();
      })(t0);
    }
    function dissolve(dur, done) {
      var rows = frames[frames.length - 1].split("\n"), h = rows.length, w = dims().cols, f = [], x, t0 = performance.now(), lastDraw = -99;
      for (x = 0; x < w; x++) f.push(1 + Math.random() * 7);
      var th = rows.map(function (r, y) { return r.split("").map(function () { return (1 - y / h) * .3 + Math.random() * .5; }); });
      (function step(now) {
        var t = Math.max(0, Math.min(1, (now - t0) / dur)), out = [];
        if (t < 1 && now - lastDraw < 30) { requestAnimationFrame(step); return; }
        lastDraw = now;
        for (var y = 0; y < h; y++) {
          var line = "";
          for (x = 0; x < w; x++) {
            var sy = y - Math.floor(t * f[x]), c = " ", ch = sy >= 0 ? rows[sy].charAt(x) : " ";
            if (ch !== " " && ch !== "") {
              var p = Math.max(0, Math.min(1, (t - (th[sy][x] || 0)) / .2)), i = ramp.indexOf(ch);
              if (i < 0) i = 4;
              c = ramp.charAt(Math.min(ramp.length - 1, i + Math.floor(p * (ramp.length - 1 - i))));
            }
            line += c;
          }
          out.push(line);
        }
        draw(out.join("\n"));
        if (t < 1) requestAnimationFrame(step); else done();
      })(t0);
    }
    function reveal() {
      gated.forEach(function (n) { n.inert = false; });
      root.dataset.entry = "opening";
      setTimeout(function () {
        removeEventListener("resize", fit);
        root.dataset.entry = "open"; screen.remove();
      }, ms("--zp-open", 1350) * 1.1 + 80);
    }
    function enter() {
      if (started) return; started = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      root.dataset.entry = "closing";
      close(ms("--zp-close", 1050), function () {
        setTimeout(function () {
          root.dataset.entry = "dissolving";
          if (calm) { draw(""); reveal(); return; }
          dissolve(ms("--zp-open", 1350) * .75, function () { draw(""); reveal(); });
        }, ms("--zp-hold", 280));
      });
    }
    fit(); draw(frames[0]); addEventListener("resize", fit);
    gated.forEach(function (n) { n.inert = true; });
    screen.addEventListener("click", enter);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
