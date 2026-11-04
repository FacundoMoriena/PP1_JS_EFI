import React, { createContext, useState, useEffect } from "react";

function loadFavoritos() {
  try {
    const saved = localStorage.getItem("favoritos_concesionaria");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(loadFavoritos);

  useEffect(() => {
    try {
      localStorage.setItem("favoritos_concesionaria", JSON.stringify(favoritos));
    } catch {
      // Manejo en caso de que localStorage esté lleno o bloqueado
    }
  }, [favoritos]);

  const esFavorito = (id) => {
    return favoritos.some((item) => item.id === id);
  };

  const toggleFavorito = (vehiculo) => {
    setFavoritos((prev) => {
      const existe = prev.some((item) => item.id === vehiculo.id);
      if (existe) {
        return prev.filter((item) => item.id !== vehiculo.id);
      }
      return [...prev, vehiculo];
    });
  };

  const removerFavorito = (id) => {
    setFavoritos((prev) => prev.filter((item) => item.id !== id));
  };

  const limpiarFavoritos = () => {
    setFavoritos([]);
  };

  const totalFavoritos = favoritos.length;

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        esFavorito,
        toggleFavorito,
        removerFavorito,
        limpiarFavoritos,
        totalFavoritos,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}
