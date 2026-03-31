import { MODES, QUICK_LINKS } from "./launcher_config.js";

const DEFAULT_QUICK_LINK_IMAGE = "episte-repo.png";

// Generar atajos numéricos en runtime basados en el orden (1, 2, 3...)
MODES.forEach((mode, index) => {
  const numKey = (index + 1).toString();
  if (!mode.keys.includes(numKey)) {
    mode.keys.push(numKey);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const viewMenu = document.getElementById("view-menu");
  const viewInput = document.getElementById("view-input");
  const inputField = document.getElementById("id-input");
  const subtitle = document.getElementById("mode-subtitle");
  const btnCancel = document.getElementById("btn-cancel");
  const btnSubmit = document.getElementById("btn-submit");
  const modeListWrapper = document.getElementById("mode-list");
  const quickLinksWrapper = document.getElementById("quick-links-list");

  let activeMode = null;

  // Genera la UI de modos basados en la configuración base
  function renderModes() {
    modeListWrapper.innerHTML = "";
    
    MODES.forEach(mode => {
      const li = document.createElement("li");
      li.className = "mode-item";

      // Render tags de tecla
      let keysHtml = '';
      mode.keys.forEach(k => {
        keysHtml += `<kbd>${k.toUpperCase()}</kbd>`;
      });

      li.innerHTML = `
        <div class="kbd-container">${keysHtml}</div>
        <span class="mode-label">${mode.title}</span>
      `;
      
      // Permitir que el click accione
      li.addEventListener("click", () => {
        switchView(true, mode.id);
      });
      
      modeListWrapper.appendChild(li);
    });
  }

  function openUrl(url) {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, "_blank");
    }
  }

  function renderQuickLinks() {
    quickLinksWrapper.innerHTML = "";

    QUICK_LINKS.forEach((link) => {
      const card = document.createElement("div");
      card.className = "quick-link-card";

      const title = document.createElement("div");
      title.className = "quick-link-title";
      title.textContent = link.title;

      const button = document.createElement("button");
      button.className = "quick-link-button";
      button.type = "button";
      button.setAttribute("aria-label", link.title);

      const image = document.createElement("img");
      image.className = "quick-link-image";
      image.src = link.image || DEFAULT_QUICK_LINK_IMAGE;
      image.alt = `${link.title} logo`;

      button.appendChild(image);
      button.addEventListener("click", () => openUrl(link.url));

      card.appendChild(title);
      card.appendChild(button);
      quickLinksWrapper.appendChild(card);
    });
  }

  function getModeById(id) {
    return MODES.find((m) => m.id === id);
  }

  // Busca los registros de modos buscando si la tecla presionada existe dentro de sus 'keys'
  function getModeByKey(keyStr) {
    return MODES.find((m) => m.keys.includes(keyStr.toLowerCase()));
  }

  function switchView(toInput, modeId = null) {
    if (toInput) {
      const mode = getModeById(modeId);
      if (!mode) return;
      
      activeMode = mode;
      viewMenu.classList.remove("active");
      viewMenu.classList.add("hidden");

      viewInput.classList.remove("hidden");
      viewInput.classList.add("active");

      subtitle.textContent = `Modo: ${mode.title}`;

      setTimeout(() => {
        inputField.value = "";
        inputField.focus();
      }, 100);
    } else {
      activeMode = null;
      inputField.value = "";

      viewInput.classList.remove("active");
      viewInput.classList.add("hidden");

      viewMenu.classList.remove("hidden");
      viewMenu.classList.add("active");

      subtitle.textContent = "Select a mode";
    }
  }

  function submitId() {
    const val = inputField.value.trim();
    if (!val) {
      inputField.classList.add("shake");
      setTimeout(() => inputField.classList.remove("shake"), 300);
      return;
    }

    if (activeMode) {
      const targetUrl = activeMode.url.replace("{ID}", val);
      openUrl(targetUrl);
    }
  }

  document.addEventListener("keydown", (e) => {
    // Si esta tocando controles especiales obviar atajo (ej. copy paste o refresh inspector)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key.toLowerCase();

    if (viewMenu.classList.contains("active")) {
      const matchedMode = getModeByKey(key);
      if (matchedMode) {
        e.preventDefault();
        switchView(true, matchedMode.id);
      }
    } else if (viewInput.classList.contains("active")) {
      if (key === "escape") {
        e.preventDefault();
        switchView(false);
      } else if (key === "enter") {
        e.preventDefault();
        submitId();
      }
    }
  });

  btnCancel.addEventListener("click", () => switchView(false));
  btnSubmit.addEventListener("click", submitId);

  // Inicializar renderizando del config
  renderModes();
  renderQuickLinks();
});
