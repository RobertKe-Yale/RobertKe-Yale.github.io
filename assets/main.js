(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- white / black ---------- */
  var KEY = "lrk-theme";
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function systemDark() { return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches; }
  function current() { return root.getAttribute("data-theme") || (systemDark() ? "dark" : "light"); }
  function paint() {
    var t = current();
    document.querySelectorAll("[data-set-theme]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-theme") === t));
    });
  }
  var s = stored();
  if (s === "light" || s === "dark") root.setAttribute("data-theme", s);
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-set-theme]");
    if (!b) return;
    var t = b.getAttribute("data-set-theme");
    root.setAttribute("data-theme", t);
    store(t);
    paint();
  });

  /* ---------- leafing through documents ---------- */
  var docs = Array.prototype.slice.call(document.querySelectorAll(".doc"));
  var ids = docs.map(function (d) { return d.id; });

  function show() {
    var id = (location.hash || "#domus").slice(1);
    if (ids.indexOf(id) < 0) id = "domus";
    docs.forEach(function (d) { d.classList.toggle("on", d.id === id); });
    document.querySelectorAll(".tree a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var doc = document.getElementById(id);
    document.title = (doc.getAttribute("data-title") || id) + " — Liangze Robert Ke";
    var p = document.getElementById("pageno");
    if (p) p.textContent = "doc " + String(ids.indexOf(id) + 1).padStart(2, "0") + "/" + String(ids.length).padStart(2, "0");
    window.scrollTo(0, 0);
  }

  /* prev / next footers, written once */
  docs.forEach(function (d, i) {
    var f = document.createElement("div");
    f.className = "eod";
    var prev = docs[i - 1], next = docs[i + 1];
    f.innerHTML =
      "<span>" + (prev ? '<a href="#' + prev.id + '">&lt; ' + prev.getAttribute("data-title") + "</a>" : "&nbsp;") + "</span>" +
      "<span>── end of document ── " + String(i + 1).padStart(2, "0") + "/" + String(docs.length).padStart(2, "0") + "</span>" +
      "<span>" + (next ? '<a href="#' + next.id + '">' + next.getAttribute("data-title") + " &gt;</a>" : "&nbsp;") + "</span>";
    d.appendChild(f);
  });

  /* keyboard: [ and ] leaf back and forth */
  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    var id = (location.hash || "#domus").slice(1), i = ids.indexOf(id);
    if (e.key === "]" && i < ids.length - 1) location.hash = ids[i + 1];
    if (e.key === "[" && i > 0) location.hash = ids[i - 1];
  });

  window.addEventListener("hashchange", show);
  show();
  paint();
})();
