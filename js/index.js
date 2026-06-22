const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("[data-section]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");

document.documentElement.classList.add("js-enabled");

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function closeNav() {
  document.body.classList.remove("nav-open");
  header.classList.remove("nav-active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  header.classList.toggle("nav-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

window.addEventListener("load", () => {
  if (!window.location.hash) {
    return;
  }

  const target = document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView({ block: "start" });
  }
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeLink = document.querySelector(
        `.nav-link[href="#${entry.target.id}"]`,
      );

      navLinks.forEach((link) => link.classList.remove("active"));
      if (activeLink) {
        activeLink.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-42% 0px -50% 0px",
    threshold: 0,
  },
);

sections.forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1200;
  const startTime = performance.now();

  function tick(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(easedProgress * target);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.7,
  },
);

counters.forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple-mark";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);

    window.setTimeout(() => {
      ripple.remove();
    }, 540);
  });
});
