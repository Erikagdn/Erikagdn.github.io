// assets/js/main.js
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  const sectionPairs = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      return section ? { id, link, section } : null;
    })
    .filter(Boolean);

  function setActiveLink(activeId) {
    for (const { id, link } of sectionPairs) {
      if (id === activeId) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    }
  }

  // Smooth scrolling & immediate active state on nav click
  for (const { id, link, section } of sectionPairs) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveLink(id);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) {
        history.replaceState(null, "", `#${id}`);
      }
    });
  }

  // Scroll-spy using IntersectionObserver
  if ("IntersectionObserver" in window && sectionPairs.length > 0) {
    const visibleRatios = new Map();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        if (window.scrollY < 80) {
          setActiveLink(sectionPairs[0].id);
          return;
        }

        const nearBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
        if (nearBottom) {
          setActiveLink(sectionPairs[sectionPairs.length - 1].id);
          return;
        }

        let bestId = null;
        let bestRatio = 0;
        for (const { id } of sectionPairs) {
          const ratio = visibleRatios.get(id) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveLink(bestId);
        }
      },
      {
        rootMargin: "-18% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75]
      }
    );

    for (const { section } of sectionPairs) {
      sectionObserver.observe(section);
    }

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY < 80) {
          setActiveLink(sectionPairs[0].id);
        } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
          setActiveLink(sectionPairs[sectionPairs.length - 1].id);
        }
      },
      { passive: true }
    );
  }

  // Subtle reveal-on-scroll animation
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length > 0) {
    document.documentElement.classList.add("js-ready");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.08
      }
    );

    for (const el of revealEls) {
      revealObserver.observe(el);
    }
  }
})();
