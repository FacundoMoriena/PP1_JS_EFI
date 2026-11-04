import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    nombre: "Facundo",
    admin: true,
  });

  const toggleAdmin = () => {
    setUser((prev) => ({ ...prev, admin: !prev.admin }));
  };

  return (
    <UserContext.Provider value={{ user, toggleAdmin }}>
      {children}
    </UserContext.Provider>
  );
}
