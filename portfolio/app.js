const works = window.portfolioWorks || [];
const workGrid = document.querySelector("#workGrid");
const filterButtons = document.querySelectorAll("[data-filter]");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxItems = document.querySelectorAll(".parallax");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxTitle = lightbox?.querySelector("strong");
const lightboxMeta = lightbox?.querySelector("span");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

function renderWorks(filter = "all") {
  if (!workGrid) return;

  const filtered = works.filter((work) => filter === "all" || work.category === filter);
  workGrid.innerHTML = "";

  filtered.forEach((work, index) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.dataset.reveal = "";
    card.style.setProperty("--delay", `${index * 60}ms`);

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `查看作品：${work.title}`);

    const image = document.createElement("img");
    image.src = work.image;
    image.alt = work.alt;
    image.loading = "lazy";

    const meta = document.createElement("div");
    meta.className = "work-meta";
    meta.innerHTML = `<span>${work.categoryLabel}</span><strong>${work.title}</strong><small>${work.location} · ${work.year}</small>`;

    button.append(image, meta);
    button.addEventListener("click", () => openLightbox(work));
    card.append(button);
    workGrid.append(card);
  });

  observeReveals();
}

function observeReveals() {
  const items = document.querySelectorAll("[data-reveal]:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, entryObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entryObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function updateParallax() {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.depth || 0);
    item.style.transform = `translate3d(0, ${scrollY * depth}px, 0)`;
  });
}

function openLightbox(work) {
  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxMeta) return;
  lightboxImage.src = work.image;
  lightboxImage.alt = work.alt;
  lightboxTitle.textContent = work.title;
  lightboxMeta.textContent = `${work.categoryLabel} · ${work.location} · ${work.year}`;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("is-locked");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderWorks(button.dataset.filter);
  });
});

window.addEventListener("scroll", updateParallax, { passive: true });
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

renderWorks();
observeReveals();
updateParallax();
