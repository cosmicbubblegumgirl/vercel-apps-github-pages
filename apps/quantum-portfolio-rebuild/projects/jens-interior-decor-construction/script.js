const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const counters = [...document.querySelectorAll("[data-count]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectTiles = [...document.querySelectorAll(".project-tile")];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const reviewImages = [...document.querySelectorAll(".review-image")];
const reviewPrev = document.querySelector("[data-review-prev]");
const reviewNext = document.querySelector("[data-review-next]");
const timelineItems = [...document.querySelectorAll(".timeline-item")];

let heroIndex = 0;
let reviewIndex = 0;
let countersStarted = false;

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
};

const animateCounters = () => {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("intro")) {
          animateCounters();
        }
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

setInterval(() => {
  heroSlides[heroIndex].classList.remove("active");
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex].classList.add("active");
}, 5200);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    projectTiles.forEach((tile) => {
      const isVisible = filter === "all" || tile.dataset.category.includes(filter);
      tile.classList.toggle("hidden", !isVisible);
    });
  });
});

projectTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    lightboxImage.src = tile.dataset.src;
    lightboxImage.alt = tile.querySelector("img").alt;
    lightboxTitle.textContent = tile.dataset.title;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

const showReview = (direction) => {
  reviewImages[reviewIndex].classList.remove("active");
  reviewIndex = (reviewIndex + direction + reviewImages.length) % reviewImages.length;
  reviewImages[reviewIndex].classList.add("active");
};

reviewPrev.addEventListener("click", () => showReview(-1));
reviewNext.addEventListener("click", () => showReview(1));

timelineItems.forEach((item) => {
  item.addEventListener("click", () => {
    timelineItems.forEach((step) => step.classList.toggle("active", step === item));
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", updateHeader);
updateHeader();
