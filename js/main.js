/* 常州的苏超之旅 —— 交互脚本
   1 页头状态与阅读进度 / 2 手机导航 / 3 滚动出现 / 4 图片灯箱 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  var doc = document.documentElement;

  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (progress) {
      var max = doc.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  var figures = document.querySelectorAll("[data-zoom]");
  if (figures.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img alt=""><button type="button" aria-label="关闭">×</button>';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var close = box.querySelector("button");

    function hide() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    figures.forEach(function (fig) {
      fig.addEventListener("click", function () {
        var source = fig.querySelector("img");
        if (!source) return;
        img.src = source.currentSrc || source.src;
        img.alt = source.alt || "";
        box.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    box.addEventListener("click", hide);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }
  /* 首屏声音开关 */
  var heroVideo = document.getElementById("heroVideo");
  var soundBtn = document.getElementById("soundToggle");
  if (heroVideo && soundBtn) {
    var label = soundBtn.querySelector("span");
    var sync = function () {
      var on = !heroVideo.muted;
      soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
      soundBtn.setAttribute("aria-label", on ? "关闭声音" : "打开声音");
      if (label) label.textContent = on ? "有声" : "声音";
    };
    soundBtn.addEventListener("click", function () {
      heroVideo.muted = !heroVideo.muted;
      if (!heroVideo.muted) {
        heroVideo.play().catch(function () {});
      }
      sync();
    });
    heroVideo.addEventListener("volumechange", sync);
    sync();
  }
})();
