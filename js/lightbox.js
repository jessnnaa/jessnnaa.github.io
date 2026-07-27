(function () {
  var overlay, imgEl, closeBtn;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    imgEl = document.createElement("img");
    imgEl.className = "lightbox-img";

    closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "닫기");
    closeBtn.innerHTML = "&times;";

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target !== imgEl) close();
    });
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();

    var images = document.querySelectorAll("body img:not(.lightbox-img)");

    images.forEach(function (img) {
      img.classList.add("lightbox-trigger");
      img.addEventListener("click", function () {
        open(img.currentSrc || img.src, img.alt);
      });
    });
  });
})();
