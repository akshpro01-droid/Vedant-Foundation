"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle instanceof HTMLButtonElement && navigation instanceof HTMLElement) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation" : "Close navigation",
    );
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const rotatingWords = ["SAME", "ALIKE", "UNIFORM", "EQUAL"];
const rotator = document.querySelector(".word-rotator");

if (rotator instanceof HTMLElement) {
  rotator.textContent = "";

  const buildWord = (word) => {
    const wordEl = document.createElement("span");
    wordEl.className = "word-rotator__word";

    Array.from(word).forEach((letter, letterIndex) => {
      const letterEl = document.createElement("span");
      letterEl.className = "word-rotator__letter";
      letterEl.style.setProperty("--letter-delay", `${(letterIndex + 1) * 90}ms`);
      letterEl.textContent = letter;
      wordEl.appendChild(letterEl);
    });

    return wordEl;
  };

  rotatingWords.forEach((word) => {
    rotator.appendChild(buildWord(word));
  });

  const wordEls = Array.from(rotator.querySelectorAll(".word-rotator__word"));
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let activeWordIndex = 0;
  let rotationTimer;

  const showFirstWord = () => {
    window.clearInterval(rotationTimer);
    rotationTimer = undefined;
    activeWordIndex = 0;

    wordEls.forEach((word, index) => {
      word.classList.toggle("is-visible", index === activeWordIndex);
      word.classList.remove("is-exit");
    });
  };

  const rotateWord = () => {
    rotationTimer = window.setInterval(() => {
      const currentWord = wordEls[activeWordIndex];
      if (!currentWord) return;

      currentWord.classList.remove("is-visible");
      currentWord.classList.add("is-exit");

      activeWordIndex = (activeWordIndex + 1) % wordEls.length;
      const nextWord = wordEls[activeWordIndex];
      if (!nextWord) return;

      nextWord.classList.remove("is-exit");
      nextWord.classList.add("is-visible");
    }, 1800);
  };

  showFirstWord();
  if (!reducedMotionQuery.matches) {
    rotateWord();
  }

  reducedMotionQuery.addEventListener("change", ({ matches }) => {
    if (matches) {
      showFirstWord();
    } else if (rotationTimer === undefined) {
      rotateWord();
    }
  });
}

const collageColumns = Array.from(document.querySelectorAll(".collage-column"));
const collageImages = collageColumns.map((column) =>
  Array.from(column.querySelectorAll(":scope > img")),
);

const buildCollageTracks = () => {
  collageColumns.forEach((column, columnIndex) => {
    const sourceImages = collageImages[columnIndex];
    if (!sourceImages?.length) return;

    const track = document.createElement("div");
    track.className = "collage-track";
    const sequence = document.createElement("div");
    sequence.className = "collage-sequence";

    sourceImages.forEach((image) => sequence.appendChild(image.cloneNode(true)));
    column.replaceChildren(track);
    track.appendChild(sequence);
    while (sequence.getBoundingClientRect().height < column.clientHeight) {
      sourceImages.forEach((image) => sequence.appendChild(image.cloneNode(true)));
    }

    track.appendChild(sequence.cloneNode(true));
  });
};

buildCollageTracks();
window.addEventListener("resize", buildCollageTracks);

if (window.gsap && window.ScrollTrigger) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (window.ScrollToPlugin) {
    gsap.registerPlugin(window.ScrollToPlugin);
    document.documentElement.classList.add("gsap-scroll-enabled");
  }

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  document
    .querySelector(".site-header")
    ?.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a[href^='#']");
      if (!(link instanceof HTMLAnchorElement)) return;

      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!(target instanceof HTMLElement)) return;

      if (window.ScrollToPlugin && !reducedMotionQuery.matches) {
        event.preventDefault();
        window.history.pushState(null, "", targetId);

        gsap.to(window, {
          duration: 1.1,
          ease: "power2.inOut",
          overwrite: "auto",
          scrollTo: {
            y: target,
            offsetY:
              document.querySelector(".site-header")?.getBoundingClientRect()
                .height ?? 0,
          },
          onUpdate: ScrollTrigger.update,
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
    });

  const navigationLinks = Array.from(
    document.querySelectorAll(".navigation a[href^='#']"),
  );
  const navigationTargets = navigationLinks.flatMap((link) => {
    const targetId = link.getAttribute("href");
    if (!targetId) return [];

    const target = document.querySelector(targetId);
    if (!(target instanceof HTMLElement)) return [];

    return [{ link, target }];
  });

  const updateActiveNavigation = () => {
    const viewportCenter = window.innerHeight / 2;
    const currentTarget = navigationTargets
      .slice()
      .reverse()
      .find(({ target }) => {
        const bounds = target.getBoundingClientRect();
        return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
      });

    navigationLinks.forEach((link) => {
      const isCurrent = currentTarget?.link === link;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const progressBar = document.querySelector(".scroll-progress span");
  const pageProgress = ScrollTrigger.create({
    start: 0,
    end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
    onUpdate: (self) => {
      if (progressBar instanceof HTMLElement) {
        gsap.set(progressBar, { scaleX: self.progress });
      }
      updateActiveNavigation();
    },
    onRefresh: (self) => {
      if (progressBar instanceof HTMLElement) {
        gsap.set(progressBar, { scaleX: self.progress });
      }
      updateActiveNavigation();
    },
  });
  ScrollTrigger.refresh();
  if (progressBar instanceof HTMLElement) {
    gsap.set(progressBar, { scaleX: pageProgress.progress });
  }
  updateActiveNavigation();

  const motionQuery = gsap.matchMedia();
  motionQuery.add("(prefers-reduced-motion: no-preference)", () => {
    const heroIntro = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroIntro
      .from(".brand", { autoAlpha: 0, y: -14, duration: 0.65 })
      .from(
        [".vertical-line p", ".small-heading", ".hero-heading1"],
        { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.16 },
        "-=0.2",
      );

    const desktopMotion = gsap.matchMedia();
    desktopMotion.add("(min-width: 761px)", () => {
      gsap.from(".navigation a", {
        autoAlpha: 0,
        y: -10,
        duration: 0.45,
        stagger: 0.08,
        delay: 0.25,
        ease: "power2.out",
      });
    });

    const stackedPages = Array.from(
      document.querySelectorAll("main > section, .site-footer"),
    );
    stackedPages.forEach((page, index) => {
      const pageBehind = stackedPages[index - 1];
      if (!pageBehind) return;

      gsap.to(pageBehind, {
        scale: 0.94,
        yPercent: -2.5,
        borderRadius: 30,
        ease: "none",
        scrollTrigger: {
          trigger: page,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    });

    const revealContent = (section, selector) => {
      const elements = section.querySelectorAll(selector);
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
          },
        },
      );
    };

    document
      .querySelectorAll(
        ".blank-page, .species-page, .reflection-page, .protein-page",
      )
      .forEach((section) => {
        const image = section.querySelector(
          ".page-two__image img, .species-page__image img, .reflection-page__image img",
        );
        if (image instanceof HTMLImageElement) {
          gsap.fromTo(
            image,
            { autoAlpha: 0.6, xPercent: -5, scale: 1.04 },
            {
              autoAlpha: 1,
              xPercent: 0,
              scale: 1,
              duration: 1.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            },
          );

          gsap.to(image, {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        if (section.classList.contains("blank-page")) {
          revealContent(section, ".page-two__eyebrow, h2, .page-two__description");
        } else if (section.classList.contains("species-page")) {
          revealContent(
            section,
            ".page-two__eyebrow, .species-page__title, .species-estimate-list li, .species-page__source",
          );
        } else if (section.classList.contains("reflection-page")) {
          revealContent(
            section,
            ".page-two__eyebrow, .reflection-page__title, .reflection-page__lead, .reflection-page__copy, .reflection-page__callout",
          );
        } else {
          revealContent(
            section,
            ".page-two__eyebrow, .protein-page__title, .protein-page__copy, .protein-page__note, .protein-card",
          );
        }
      });

    const footer = document.querySelector(".site-footer");
    if (footer instanceof HTMLElement) {
      revealContent(
        footer,
        ".site-footer__eyebrow, .site-footer__message h2, .site-footer__copy, .site-footer__action, .site-footer__contact a, .site-footer__bottom",
      );
    }
  });
} else {
  console.warn(
    "GSAP ScrollTrigger failed to load. Scroll-based motion enhancements are disabled.",
  );
}