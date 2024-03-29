import React from 'react';
import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, signInWithEmailAndPassword } from "../firebase"; 

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    return () => unsubscribe();
  }, []);

  function signInWithFirebase(email, password) {
    return signInWithEmailAndPassword(auth, email, password); 
  }

  const signOutUser = () => {
    return signOut(auth); 
  };

  const value = {
    authUser,
    signInWithFirebase,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
