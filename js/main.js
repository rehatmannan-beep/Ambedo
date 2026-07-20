(function () {
  "use strict";

  /* =========================================================================
     Ambedo Holdings — Interactions & Scroll-Driven Build Animation
     ========================================================================= */

  /* --- Mobile nav toggle --- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Header scroll shadow --- */
  if (header) {
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > 20) { header.classList.add("scrolled"); }
      else { header.classList.remove("scrolled"); }
      lastScroll = y;
    }, { passive: true });
  }

  /* --- FAQ accordion --- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = btn.nextElementSibling;
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) {
        panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
      }
    });
  });

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* --- Animated stat counters --- */
  var statEls = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && statEls.length) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countIO.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var duration = 1800;
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var ease = 1 - Math.pow(1 - t, 3);
          var current = Math.round(target * ease);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.3 });
    statEls.forEach(function (el) { countIO.observe(el); });
  }

  /* =========================================================================
     SCROLL-DRIVEN SCAFFOLDING BUILD ANIMATION
     ========================================================================= */
  var theater = document.querySelector(".scaffold-theater");
  if (theater) {
    var stage = theater.querySelector(".scaffold-stage");
    var buildEls = theater.querySelectorAll(".build-el");
    var steps = theater.querySelectorAll(".scaffold-step");
    var dots = theater.querySelectorAll(".scaffold-dot");
    var barFill = theater.querySelector(".scaffold-bar-fill");
    var totalStages = steps.length;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      buildEls.forEach(function (el) { el.classList.add("visible"); });
      steps.forEach(function (s, i) {
        s.classList.toggle("active", i === totalStages - 1);
      });
      dots.forEach(function (d) { d.classList.add("passed"); });
      if (barFill) barFill.style.width = "100%";
    } else {
      function updateScaffold() {
        var rect = theater.getBoundingClientRect();
        var theaterHeight = theater.offsetHeight;
        var viewH = window.innerHeight;
        var scrolled = -rect.top;
        var scrollable = theaterHeight - viewH;
        if (scrollable <= 0) return;
        var progress = Math.max(0, Math.min(1, scrolled / scrollable));

        if (barFill) barFill.style.width = (progress * 100) + "%";

        var activeStage = Math.min(
          totalStages - 1,
          Math.floor(progress * totalStages)
        );

        steps.forEach(function (s, i) {
          s.classList.toggle("active", i === activeStage);
        });

        dots.forEach(function (d, i) {
          d.classList.toggle("active", i === activeStage);
          d.classList.toggle("passed", i < activeStage);
        });

        buildEls.forEach(function (el) {
          var stageNum = parseInt(el.getAttribute("data-stage"), 10);
          var show = stageNum <= activeStage;
          el.classList.toggle("visible", show);
        });
      }

      var ticking = false;
      window.addEventListener("scroll", function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            updateScaffold();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      updateScaffold();
    }
  }

  /* --- Prefill service field from ?service= query param (Google Ads) --- */
  try {
    var params = new URLSearchParams(window.location.search);
    var svc = params.get("service");
    var svcField = document.getElementById("service");
    if (svc && svcField) {
      for (var i = 0; i < svcField.options.length; i++) {
        if (svcField.options[i].value.toLowerCase() === svc.toLowerCase()) {
          svcField.selectedIndex = i;
          break;
        }
      }
    }
  } catch (e) { /* no-op */ }

  /* --- Track UTM params for lead attribution --- */
  try {
    var utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
    var searchParams = new URLSearchParams(window.location.search);
    var utmData = {};
    utmParams.forEach(function (key) {
      var val = searchParams.get(key);
      if (val) utmData[key] = val;
    });
    if (Object.keys(utmData).length) {
      try { sessionStorage.setItem("ambedo_utm", JSON.stringify(utmData)); } catch (e) {}
    }
    document.querySelectorAll("form").forEach(function (form) {
      var stored = {};
      try { stored = JSON.parse(sessionStorage.getItem("ambedo_utm") || "{}"); } catch (e) {}
      Object.keys(stored).forEach(function (key) {
        if (!form.querySelector('input[name="' + key + '"]')) {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = stored[key];
          form.appendChild(input);
        }
      });
    });
  } catch (e) { /* no-op */ }

  /* --- Form submit UX: disable button, show sending state --- */
  document.querySelectorAll("form[data-netlify], form.js-form").forEach(function (form) {
    form.addEventListener("submit", function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.setAttribute("disabled", "disabled");
        btn.dataset.label = btn.textContent;
        btn.textContent = "Sending…";
      }
    });
  });

  /* --- Phone number formatting --- */
  var phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      var raw = input.value.replace(/\D/g, "");
      if (raw.length >= 10) {
        var area = raw.substring(0, 3);
        var mid = raw.substring(3, 6);
        var last = raw.substring(6, 10);
        input.value = "(" + area + ") " + mid + "-" + last;
      }
    });
  });

  /* --- Current year in footer --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight + 10 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
})();
