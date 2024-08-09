// GlobalRefreshContext.js
import React, { createContext, useContext, useState } from "react";

const GlobalRefreshContext = createContext();

export const useGlobalRefresh = () => useContext(GlobalRefreshContext);

export const GlobalRefreshProvider = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = () => {
    setRefreshing(true);
    // Add logic to refresh data globally, e.g., fetch updated data for all components/pages
    setTimeout(() => setRefreshing(false), 2000); // Simulating a delay
  };

  return (
    <GlobalRefreshContext.Provider value={{ refreshing, triggerRefresh }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};
