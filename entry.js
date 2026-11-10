(function () {
  var root = document.documentElement, KEY = "entered", FADE = 700;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var entered = false;
  try { entered = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  root.dataset.entry = entered ? "open" : "locked";
  function init() {
    var screen = document.getElementById("entry"), btn = screen && screen.querySelector(".entry-btn");
    var gated = document.querySelectorAll(".nav, main, footer");
    if (!screen || !btn) { root.dataset.entry = "open"; return; }
    if (root.dataset.entry === "open") { screen.remove(); return; }
    gated.forEach(function (n) { n.inert = true; });
    btn.focus({ preventScroll: true });
    var done = false;
    function enter() {
      if (done) return; done = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      gated.forEach(function (n) { n.inert = false; });
      root.dataset.entry = "opening";
      var finish = function () { root.dataset.entry = "open"; screen.remove(); };
      if (reduce) finish(); else setTimeout(finish, FADE + 50);
    }
    btn.addEventListener("click", enter);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
