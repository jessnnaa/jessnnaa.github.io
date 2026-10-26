(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
  }

  function current() {
    return stored() || (media.matches ? "dark" : "light");
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  // Runs in <head> before paint, so the page never flashes the wrong theme
  apply(current());

  // Follow OS changes until the visitor picks a theme themselves
  media.addEventListener("change", function () {
    if (!stored()) apply(current());
  });

  var SUN =
    '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var MOON =
    '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function label(btn) {
    var dark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
    btn.setAttribute("title", dark ? "라이트 모드" : "다크 모드");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector("nav");
    if (!nav) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML = SUN + MOON;
    label(btn);

    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      save(next);
      label(btn);
    });

    // Group the toggle with whatever already sits on the right side of the nav
    var actions = document.createElement("div");
    actions.className = "nav-actions";
    Array.prototype.slice.call(nav.children).forEach(function (el) {
      if (!el.classList.contains("nav-logo")) actions.appendChild(el);
    });
    actions.appendChild(btn);
    nav.appendChild(actions);
  });
})();
