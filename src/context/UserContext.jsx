import { createContext, useState, useEffect } from "react";

function loadAdminState() {
  try {
    const saved = localStorage.getItem("concesionaria_admin");
    return saved !== null ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => ({
    nombre: "Facundo",
    admin: loadAdminState(),
  }));

  useEffect(() => {
    try {
      localStorage.setItem("concesionaria_admin", JSON.stringify(user.admin));
    } catch {
      // localStorage bloqueado
    }
  }, [user.admin]);

  const toggleAdmin = () => {
    setUser((prev) => ({ ...prev, admin: !prev.admin }));
  };

  return (
    <UserContext.Provider value={{ user, toggleAdmin }}>
      {children}
    </UserContext.Provider>
  );
}
