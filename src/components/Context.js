import React, { createContext, useState } from "react";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [forceLogout, setForceLogout] = useState(false);
 
  const setLogout = () => {
    setForceLogout(true);
  };

  const authContextValue = {
    forceLogout,
    setForceLogout,
    setLogout,
   
  };

  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
