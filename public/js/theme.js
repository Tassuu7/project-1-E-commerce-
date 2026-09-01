/**
 * Theme Manager - Light / Black Dark Mode Switcher
 * Persists user preference across all store pages
 */

(function () {
  const savedTheme = localStorage.getItem('omni_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('omni_theme', newTheme);
  updateThemeButtonUI();
}

function updateThemeButtonUI() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    if (currentTheme === 'dark') {
      btn.innerHTML = '☀️ Light Mode';
      btn.title = 'Switch to Light Theme';
    } else {
      btn.innerHTML = '🌙 Dark Mode';
      btn.title = 'Switch to Black Dark Theme';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeButtonUI();
});
