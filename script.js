document.documentElement.classList.add("js-enabled");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");

// Opens or closes the mobile navigation and keeps its accessibility state in sync.
function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navLinks.classList.toggle("is-open", isOpen);
}

// Closes the mobile menu after a navigation link is chosen.
function closeMenuAfterNavigation() {
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

// Marks the navigation link for the section currently visible on screen.
function observeSections() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinkItems.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isCurrent);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Reveals content as it enters the viewport, or leaves it visible on older browsers.
function observeRevealItems() {
  if (!("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("js-enabled");
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Validates the contact details and opens a pre-filled message in the visitor's email app.
function handleContactSubmit(event) {
  event.preventDefault();
  formStatus.textContent = "";

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete every field before continuing.";
    return;
  }

  // Replace this with the email address where you want to receive messages.
  const recipientEmail = "your-email@example.com";
  if (recipientEmail === "your-email@example.com") {
    formStatus.textContent = "Add your email address in script.js to enable this form.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  formStatus.textContent = "Your email app should open with your message ready to send.";
}

// Sets the footer year automatically.
function setCurrentYear() {
  currentYear.textContent = new Date().getFullYear();
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

closeMenuAfterNavigation();
observeSections();
observeRevealItems();
contactForm.addEventListener("submit", handleContactSubmit);
setCurrentYear();
