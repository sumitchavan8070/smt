import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import globalStrings from "../utils/globalStrings";
//context
const AuthContext = createContext();

//provider
const AuthProvider = ({ children }) => {
  //golbal state
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  // initial local storage data
  useEffect(() => {
    const loadLoaclStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");

      let loginData = JSON.parse(data);

      setState({ ...state, user: loginData?.user, token: loginData?.token });
    };
    loadLoaclStorageData();
  }, []);

  let token = state && state.token;

  //default axios setting
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // axios.defaults.baseURL = "http://192.168.43.78:8080/api/v1/auth";
  // axios.defaults.baseURL = "https://meadhikari-server.onrender.com/api/v1/auth";
  axios.defaults.baseURL = globalStrings.BASE_URL;
  // utils >> globalstring

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
