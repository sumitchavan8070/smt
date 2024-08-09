import React, { useMemo, memo } from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { Border, Color, Padding } from "../../GlobalStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const FooterMenu = memo(({ handleSwipeGesture }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={handleSwipeGesture}>
        <View style={[styles.container]}>
          <View style={[styles.footer, styles.footerStyle]}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <FontAwesome5
                name="home"
                style={[styles.homeIcon]}
                color={route.name === "Home" && Color.primaryColor}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Blog")}>
              <FontAwesome5
                name="coffee"
                style={[styles.blogsIcon]}
                color={route.name === "Blog" && Color.primaryColor}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <FontAwesome5
            name="history"
            style={[styles.historyIcon]}
            color={route.name === "History" && Color.primaryColor}
          />
        </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("CommonScreen")}
            >
              <FontAwesome
                name="group"
                style={[styles.historyIcon]}
                color={route.name === "CommonScreen" && Color.primaryColor}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <FontAwesome5
                name="user"
                style={[styles.historyIcon]}
                color={route.name === "Profile" && Color.primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // padding: "unset",
    // top: 700,
    // left: 19,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    display: "flex",
    width: "100%",
    flex: 1,
    // zIndex: 100,
    padding: "5%",
  },

  homeIcon: {
    fontSize: 25,
  },
  blogsIcon: {
    fontSize: 25,
  },
  historyIcon: {
    fontSize: 25,
  },
  profileIcon: {
    width: 30,
  },
  footer: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.secoundaryBtnColor,
    borderStyle: "solid",
    borderColor: Color.colorGray,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Padding.p_3xs,
    borderTopWidth: 1,
  },
});

export default FooterMenu;
