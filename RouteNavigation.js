import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "./Context/authContext";
import ScreenMenu from "./Components/Menus/ScreenMenu";

const RouteNavigation = () => {
  return (
    //      {/* to manage global state of the application we will use auth provider */}

    <AuthProvider>
      <ScreenMenu></ScreenMenu>
    </AuthProvider>
  );
};

export default RouteNavigation;
