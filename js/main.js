// Ganti username ini dengan akun GitHub milikmu.
const GITHUB_USERNAME = "octocat";

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("portfolio-theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  themeButton.setAttribute("aria-label", theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap");
}
setTheme(savedTheme || (systemDark ? "dark" : "light"));
themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
filterButtons.forEach((button) => button.addEventListener("click", () => {
  filterButtons.forEach((item) => item.classList.toggle("active", item === button));
  const filter = button.dataset.filter;
  projectCards.forEach((card) => card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter));
}));

const toast = document.querySelector(".toast");
let toastTimer;
document.querySelector(".email-copy").addEventListener("click", async (event) => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Email disalin ke clipboard";
  } catch {
    toast.textContent = `Email: ${email}`;
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
});

async function loadGithubRepos() {
  const status = document.querySelector("#github-status");
  const list = document.querySelector("#github-repos");
  const profile = document.querySelector("#github-profile");
  profile.href = `https://github.com/${GITHUB_USERNAME}`;
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=3`);
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const repos = await response.json();
    if (!repos.length) throw new Error("No public repositories");
    status.textContent = "REPOSITORI TERBARU";
    list.innerHTML = repos.map((repo) => `<a class="repo-item" href="${repo.html_url}" target="_blank" rel="noreferrer"><span>${escapeHtml(repo.name)}</span><span>★ ${repo.stargazers_count}</span></a>`).join("");
  } catch (error) {
    status.textContent = "Repo belum tersedia — ganti GITHUB_USERNAME di js/main.js.";
    console.info("GitHub repos unavailable:", error.message);
  }
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
loadGithubRepos();
