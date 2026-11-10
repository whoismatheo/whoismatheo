(function () {
  var root = document.documentElement, KEY = "entered";
  var entered = false;
  try { entered = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  root.dataset.entry = entered ? "open" : "locked";
  function ms(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    if (/ms$/.test(v)) return parseFloat(v);
    if (/s$/.test(v)) return parseFloat(v) * 1000;
    return fallback;
  }
  function init() {
    var screen = document.getElementById("entry"), btn = screen && screen.querySelector(".entry-btn");
    var stage = screen && screen.querySelector(".zp-stage");
    var gated = document.querySelectorAll(".nav, main, footer");
    if (!screen || !btn) { root.dataset.entry = "open"; return; }
    if (root.dataset.entry === "open") { screen.remove(); return; }
    function fit() {
      var k = Math.max(.45, Math.min((innerWidth - 24) / 360, innerHeight * .64 / 400, 1.7));
      screen.style.setProperty("--k", k.toFixed(3));
    }
    fit(); addEventListener("resize", fit);
    gated.forEach(function (n) { n.inert = true; });
    var started = false;
    function enter() {
      if (started) return; started = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      root.dataset.entry = "closing";
      setTimeout(function () {
        gated.forEach(function (n) { n.inert = false; });
        root.dataset.entry = "opening";
        setTimeout(function () {
          removeEventListener("resize", fit);
          root.dataset.entry = "open"; screen.remove();
        }, ms("--zp-open", 1350) * 1.25 + 80);
      }, ms("--zp-close", 1050) + ms("--zp-hold", 280));
    }
    btn.addEventListener("click", enter);
    if (stage) stage.addEventListener("click", enter);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
