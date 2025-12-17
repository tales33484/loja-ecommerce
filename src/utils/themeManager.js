const STORAGE_KEY = "site-theme";

export const applyTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY) || "night"; // padrão
  document.documentElement.setAttribute("data-theme", savedTheme);
  return savedTheme;
};

export const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
};
