import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Color, FontSize } from "../../GlobalStyles";
import { Image } from "expo-image";

const HeaderMenu = () => {
  return (
    <View style={[styles.header]}>
      <Image
        style={styles.profile}
        contentFit="cover"
        source={require("../../assets/all/profilePic.png")}
      />
      <Text style={styles.meadhikari}>MeAdhikari</Text>
      <Image
        style={styles.bellIcon}
        contentFit="cover"
        source={require("../../assets//all/bell.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: 57,
    height: 56,
  },
  meadhikari: {
    textTransform: "capitalize",
    // fontFamily: FontFamily.robotoBold,
    color: Color.red,
    textAlign: "center",
    fontWeight: "700",
    fontSize: FontSize.size_lg,
  },
  bellIcon: {
    width: 25,
    height: 25,
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingHorizontal: "5%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // zIndex: 9999,
    paddingVertical: 10,
    // backgroundColor: Color.red,
  },
});

export default HeaderMenu;
