const THEME_KEY = "familyBudgetTheme";
const themeBtn = document.getElementById("themeBtn");

function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    if (themeBtn) {
        themeBtn.textContent = isDark ? "☀️" : "🌙";
    }
}

function loadTheme() {
    applyTheme(localStorage.getItem(THEME_KEY) === "dark");
}

function toggleTheme() {
    const isDark = !document.body.classList.contains("dark");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    applyTheme(isDark);
}

loadTheme();

if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
}
