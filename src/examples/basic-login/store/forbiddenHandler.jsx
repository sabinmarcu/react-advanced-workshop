import { createContext, useContext, useState } from 'react';

export const ForbiddenHandlerContext = createContext();

export const ForbiddenHandlerProvider = ({ children }) => {
  const store = useState();
  return (
    <ForbiddenHandlerContext.Provider value={store}>
      {children}
    </ForbiddenHandlerContext.Provider>
  );
};

export const useForbiddenHandler = () => useContext(ForbiddenHandlerContext);
