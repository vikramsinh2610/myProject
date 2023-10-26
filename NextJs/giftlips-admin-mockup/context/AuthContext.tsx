import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const data = JSON.parse(localUser);

      if (data?.user) {
        setUser(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
