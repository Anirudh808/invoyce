import { createContext, useContext } from "react";

async function getUserData() {
  const response = await fetch("/api/users");
  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
  }
}

const user = await getUserData();

const userContext = createContext(user);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error("UserContext was used outside of user provider");
  }
  return context;
}
