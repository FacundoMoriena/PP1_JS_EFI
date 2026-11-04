import React, { createContext, useState, useEffect } from "react";

function loadTheme() {
  try {
    const saved = localStorage.getItem("concesionaria_theme");
    return saved || "dark";
  } catch {
    return "dark";
  }
}

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    try {
      localStorage.setItem("concesionaria_theme", theme);
    } catch {
      // localStorage bloqueado
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
