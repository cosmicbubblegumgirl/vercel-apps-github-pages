(() => {
  const consoleContent = {
    retention: {
      label: "Retention",
      title: "Customer relationships stay warm because follow-up is deliberate.",
      text: "Regular visits, satisfaction checks, issue resolution, and internal coordination keep important accounts from drifting.",
      track: 25
    },
    revenue: {
      label: "Revenue",
      title: "Commercial pressure becomes a managed rhythm.",
      text: "Monthly KPIs, price adjustments, quotations, proposals and contract details are kept visible, current and accountable.",
      track: 50
    },
    tenders: {
      label: "Tenders",
      title: "Paperwork becomes a customer-confidence signal.",
      text: "Tender packs, CRM records, data sheets, job cards, labels and service codes are followed through with detail.",
      track: 75
    },
    service: {
      label: "Service",
      title: "The customer gets one steady point of care.",
      text: "She connects sales, technical, customer care, site management and service teams around what the account needs next.",
      track: 100
    }
  };

  const playbookContent = {
    listen: {
      label: "Listen",
      title: "Start with customer needs and account context.",
      text: "She identifies customer needs, service requirements, recurring queries, satisfaction risks, and the internal teams needed to resolve them."
    },
    price: {
      label: "Price",
      title: "Turn requirements into accurate commercial action.",
      text: "Pricing, quotations, increases, proposals, tender packs, and contract maintenance are handled with careful follow-up and database accuracy."
    },
    coordinate: {
      label: "Coordinate",
      title: "Keep service delivery connected across teams.",
      text: "She links customers with technical sales, customer care, site management, service teams, data sheets, job cards, labels, and safe-disposal documentation."
    },
    retain: {
      label: "Retain",
      title: "Protect the account through consistent follow-through.",
      text: "Retention comes from regular visits, proactive communication, satisfaction checks, issue resolution, SLA attention, and a clear record of what happens next."
    }
  };

  const careerContent = {
    "key-account": {
      label: "Current focus",
      title: "Key account consulting",
      text: "Owns client retention, monthly KPIs, SLA follow-up, price adjustments, quotations, CRM records, tender submissions, and account conversations for important customers."
    },
    sales: {
      label: "Sales consulting",
      title: "Account maintenance and commercial delivery",
      text: "Maintained customer accounts, prepared pricing and tenders, managed contract updates, followed data sheets, and supported improved service delivery."
    },
    technical: {
      label: "Technical sales support",
      title: "Service documentation and customer coordination",
      text: "Coordinated safe-disposal certificates, service codes, job cards, labels, quotations, proposals, data sheets, carryover notifications, and department support."
    },
    admin: {
      label: "Foundation",
      title: "Sales administration discipline",
      text: "Built the administrative base through client calls, service messages, quotation capture, service code follow-up, job cards, labels, and dependable customer support."
    }
  };

  const heroWords = [
    "client retention",
    "commercial follow-through",
    "service coordination",
    "tender readiness",
    "CRM accuracy",
    "relationship trust"
  ];

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("ready");
    setCurrentYear();
    initReveals();
    initScrollProgress();
    initActiveNavigation();
    initHeroRotator();
    initConsole();
    initPlaybook();
    initCareerDetails();
    initFocusBuilder();
    initCopyEmail();
    initLightbox();
    initTilt();
  });

  function setCurrentYear() {
    const year = document.querySelector("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initReveals() {
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
  }

  function initScrollProgress() {
    const bar = document.querySelector(".page-progress span");
    if (!bar) return;

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
      bar.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initActiveNavigation() {
    const links = Array.from(document.querySelectorAll(".nav-links a"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const id = `#${visible.target.id}`;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === id));
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.12, 0.25, 0.5, 0.75]
    });

    sections.forEach((section) => observer.observe(section));
  }

  function initHeroRotator() {
    const target = document.querySelector("#heroRotator");
    if (!target) return;
    let index = 0;

    setInterval(() => {
      index = (index + 1) % heroWords.length;
      target.classList.add("switching");
      setTimeout(() => {
        target.textContent = heroWords[index];
        target.classList.remove("switching");
      }, 180);
    }, 2400);
  }

  function initConsole() {
    const buttons = Array.from(document.querySelectorAll("[data-console]"));
    const label = document.querySelector("#consoleLabel");
    const title = document.querySelector("#consoleTitle");
    const text = document.querySelector("#consoleText");
    const track = document.querySelector("#consoleTrack");
    if (!buttons.length || !label || !title || !text || !track) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = consoleContent[button.dataset.console];
        if (!content) return;
        setActive(buttons, button);
        label.textContent = content.label;
        title.textContent = content.title;
        text.textContent = content.text;
        track.style.width = `${content.track}%`;
      });
    });
  }

  function initPlaybook() {
    const buttons = Array.from(document.querySelectorAll("[data-playbook]"));
    const label = document.querySelector("#playbookLabel");
    const title = document.querySelector("#playbookTitle");
    const text = document.querySelector("#playbookText");
    bindContentButtons(buttons, playbookContent, label, title, text, "playbook");
  }

  function initCareerDetails() {
    const items = Array.from(document.querySelectorAll("[data-career-card]"));
    const label = document.querySelector("#careerLabel");
    const title = document.querySelector("#careerTitle");
    const text = document.querySelector("#careerText");
    if (!items.length || !label || !title || !text) return;

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const content = careerContent[item.dataset.careerCard];
        if (!content) return;
        items.forEach((entry) => entry.classList.toggle("current", entry === item));
        label.textContent = content.label;
        title.textContent = content.title;
        text.textContent = content.text;
      });
    });
  }

  function bindContentButtons(buttons, source, label, title, text, dataKey) {
    if (!buttons.length || !label || !title || !text) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = source[button.dataset[dataKey]];
        if (!content) return;
        setActive(buttons, button);
        label.textContent = content.label;
        title.textContent = content.title;
        text.textContent = content.text;
      });
    });
  }

  function initFocusBuilder() {
    const buttons = Array.from(document.querySelectorAll("[data-focus]"));
    const meter = document.querySelector("#builderMeter");
    const title = document.querySelector("#builderTitle");
    const summary = document.querySelector("#builderSummary");
    if (!buttons.length || !meter || !title || !summary) return;

    const update = () => {
      const selected = buttons
        .filter((button) => button.classList.contains("active"))
        .map((button) => button.dataset.focus);
      const percent = Math.max(12, Math.round((selected.length / buttons.length) * 100));
      meter.style.width = `${percent}%`;

      title.textContent = selected.length >= 4
        ? "Full-service key account profile"
        : selected.length >= 2
          ? "Balanced key account profile"
          : "Focused account strength";
      summary.textContent = selected.length
        ? `Launell's portfolio currently highlights ${formatList(selected)}.`
        : "Choose a focus area to shape the account story.";
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        update();
      });
    });

    update();
  }

  function initCopyEmail() {
    const button = document.querySelector("[data-copy-email]");
    if (!button) return;

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("govenderlaunell@gmail.com");
        showToast("Email copied to clipboard.");
      } catch (error) {
        showToast("Email: govenderlaunell@gmail.com");
      }
    });
  }

  function initLightbox() {
    const images = Array.from(document.querySelectorAll("[data-lightbox-image]"));
    const lightbox = document.querySelector("#mediaLightbox");
    if (!images.length || !lightbox) return;

    const preview = lightbox.querySelector("img");
    const caption = lightbox.querySelector("p");
    const close = lightbox.querySelector("[data-lightbox-close]");

    const hide = () => {
      lightbox.hidden = true;
      document.body.classList.remove("no-scroll");
    };

    images.forEach((image) => {
      image.addEventListener("click", (event) => {
        event.stopPropagation();
        const figure = image.closest("figure");
        preview.src = image.src;
        preview.alt = image.alt;
        caption.textContent = figure?.querySelector("figcaption")?.textContent || "";
        lightbox.hidden = false;
        document.body.classList.add("no-scroll");
      });
    });

    close?.addEventListener("click", hide);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) hide();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) hide();
    });
  }

  function initTilt() {
    const elements = Array.from(document.querySelectorAll("[data-tilt]"));
    if (!elements.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    elements.forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        element.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
      });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function setActive(items, activeItem) {
    items.forEach((item) => {
      const active = item === activeItem;
      item.classList.toggle("active", active);
      if (item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", String(active));
    });
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function formatList(items) {
    if (items.length <= 1) return items[0] || "";
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
  }
})();
