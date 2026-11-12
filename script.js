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
  "cat skills.txt": "skills",
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
        "tabs: cat about.txt | cat experience.log | ls ./projects | cat education.txt | cat skills.txt | other: ls | whoami | pwd | uname -a | clear"
      );
      terminalInput.value = "";
      return;
    }

    if (cmd === "ls") {
      showTerminalOutput("about.txt  experience.log  projects/  education.txt  skills.txt");
      terminalInput.value = "";
      return;
    }

    if (cmd === "whoami") {
      showTerminalOutput("james");
      terminalInput.value = "";
      return;
    }

    if (cmd === "pwd") {
      showTerminalOutput("/home/james");
      terminalInput.value = "";
      return;
    }

    if (cmd === "uname -a" || cmd === "uname") {
      showTerminalOutput("QNX james-portfolio 7.1.0 aarch64 GNU/RTOS");
      terminalInput.value = "";
      return;
    }

    if (cmd === "sudo" || cmd.startsWith("sudo ")) {
      showTerminalOutput("james is not in the sudoers file. This incident will be reported.", true);
      terminalInput.value = "";
      return;
    }

    if (cmd.startsWith("echo ")) {
      showTerminalOutput(raw.slice(5));
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

// CRT color theme toggle (blue -> amber -> green)
const themeToggleBtn = document.getElementById("theme-toggle");
const themes = ["blue", "amber", "green"];

function applyTheme(theme) {
  const valid = themes.includes(theme) ? theme : "blue";
  if (valid === "blue") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", valid);
  }
  if (themeToggleBtn) {
    themeToggleBtn.textContent = `[theme: ${valid}]`;
  }
  localStorage.setItem("portfolio-theme", valid);
}

applyTheme(localStorage.getItem("portfolio-theme") || "blue");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = localStorage.getItem("portfolio-theme") || "blue";
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    applyTheme(next);
  });
}

// Discord-style "Playing a Game" live Vancouver time
const vancouverTimerEl = document.getElementById("vancouver-timer");
const vancouverTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function updateVancouverTimer() {
  if (!vancouverTimerEl) return;
  vancouverTimerEl.textContent = vancouverTimeFormatter.format(new Date());
}

updateVancouverTimer();
setInterval(updateVancouverTimer, 1000);
