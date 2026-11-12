// Print / Save PDF button
const printBtn = document.getElementById("print-resume-btn");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

// Tab switching
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

function activateTab(tabName, updateHash = true) {
  const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  const targetPanel = document.getElementById(`panel-${tabName}`);
  if (!targetBtn || !targetPanel) return;

  tabButtons.forEach((btn) => {
    const active = btn === targetBtn;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel === targetPanel);
  });

  if (updateHash) {
    history.replaceState(null, "", `#${tabName}`);
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activateTab(btn.dataset.tab);
  });
});

// Keyboard shortcuts: press 1-5 to switch tabs (when not typing in an input)
const tabOrder = ["about", "experience", "projects", "education", "skills"];
document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  const num = Number(e.key);
  if (num >= 1 && num <= tabOrder.length) {
    activateTab(tabOrder[num - 1]);
  }
});

// Open tab from URL hash on load (e.g. #projects)
const initialHash = window.location.hash.replace("#", "");
if (tabOrder.includes(initialHash)) {
  activateTab(initialHash, false);
}

// Project category filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

// Interactive top terminal prompt
const terminalForm = document.getElementById("terminal-form");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

const commandToTab = {
  "cat about.txt": "about",
  "cat experience.log": "experience",
  "ls ./projects": "projects",
  "ls projects": "projects",
  "cat education.txt": "education",
  "neofetch --skills": "skills",
  "neofetch": "skills",
};

function clearTerminalOutput() {
  if (!terminalOutput) return;
  terminalOutput.textContent = "";
  terminalOutput.classList.remove("is-error");
  terminalOutput.hidden = true;
}

function showTerminalOutput(message, isError = false) {
  if (!terminalOutput) return;
  terminalOutput.textContent = message;
  terminalOutput.classList.toggle("is-error", isError);
  terminalOutput.hidden = false;
}

if (terminalForm && terminalInput) {
  terminalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = terminalInput.value.trim();
    const cmd = raw.toLowerCase();

    if (!cmd) {
      clearTerminalOutput();
      return;
    }

    if (cmd === "clear") {
      clearTerminalOutput();
      terminalInput.value = "";
      return;
    }

    if (cmd === "help") {
      showTerminalOutput(
        "commands: cat about.txt | cat experience.log | ls ./projects | cat education.txt | neofetch --skills | clear"
      );
      terminalInput.value = "";
      return;
    }

    const targetTab = commandToTab[cmd];
    if (targetTab) {
      clearTerminalOutput();
      activateTab(targetTab);
      terminalInput.value = "";
      return;
    }

    const bin = raw.split(/\s+/)[0];
    showTerminalOutput(`bash: ${bin}: command not found`, true);
    terminalInput.select();
  });
}
