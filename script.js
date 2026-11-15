const ARCHON_CONFIG = {
  downloadUrl: "https://github.com/archi1363-cmd/archon-releases/releases/download/v1.0.0/ArchonSoundAI_Setup.zip",
  buyUrl: "#",
  siteUrl: "https://archi1363-cmd.github.io/archon-site/",
  youtubeRammstein: "https://youtu.be/jVGNDJ0eDWc",
  version: "1.0.0"
};

(() => {
  "use strict";

  const languageButtons = document.querySelectorAll("[data-language]");
  const buyButton = document.getElementById("buy-button");
  const buyModal = document.getElementById("buy-modal");
  let lastFocusedElement = null;

  function setLanguage(language) {
    const selectedLanguage = language === "ru" ? "ru" : "en";

    document.documentElement.lang = selectedLanguage;
    document.querySelectorAll("[data-ru][data-en]").forEach((element) => {
      element.textContent = element.dataset[selectedLanguage];
    });
    document.querySelectorAll("[data-aria-ru][data-aria-en]").forEach((element) => {
      element.setAttribute("aria-label", element.getAttribute(`data-aria-${selectedLanguage}`));
    });
    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === selectedLanguage;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyConfig() {
    document.querySelectorAll("[data-config-url]").forEach((element) => {
      const url = ARCHON_CONFIG[element.dataset.configUrl];
      if (typeof url === "string") {
        element.setAttribute("href", url);
      }
    });
    document.documentElement.dataset.archonVersion = ARCHON_CONFIG.version;
  }

  function openBuyModal(event) {
    if (ARCHON_CONFIG.buyUrl !== "#") {
      return;
    }
    event.preventDefault();
    lastFocusedElement = document.activeElement;
    buyModal.hidden = false;
    buyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    buyModal.querySelector(".modal-close").focus();
  }

  function closeBuyModal() {
    if (buyModal.hidden) {
      return;
    }
    buyModal.hidden = true;
    buyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  buyButton.addEventListener("click", openBuyModal);
  buyModal.addEventListener("click", (event) => {
    if (event.target === buyModal || event.target.closest("[data-close-modal]")) {
      closeBuyModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (buyModal.hidden) {
      return;
    }
    if (event.key === "Escape") {
      closeBuyModal();
      return;
    }
    if (event.key === "Tab") {
      const focusableElements = buyModal.querySelectorAll("button, a[href]");
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  applyConfig();
  const detectedLanguage = (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en";
  setLanguage(detectedLanguage);
})();
