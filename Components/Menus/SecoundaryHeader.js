import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Border, Color, FontSize, Padding } from "../../GlobalStyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const SecoundaryHeader = ({ pageName }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.topnavexamdetail}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <FontAwesome5 name="times" style={[styles.icon]} />
      </TouchableOpacity>
      <Text style={styles.title}>{pageName}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <FontAwesome5 name="share-alt" style={[styles.icon]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.primaryColor,
    display: "flex",
    justifyContent: "center",
    width: 265,
    height: 24,
    textAlign: "center",
    fontSize: FontSize.size_base,
    alignItems: "center",
    alignSelf: "center",
  },
  icon: {
    color: Color.primaryColor,
    fontSize: 20,
  },
  topnavexamdetail: {
    top: "10%",
    borderRadius: Border.br_3xs,
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowRadius: 4,
    // elevation: 4,
    // shadowOpacity: 1,
    borderStyle: "solid",
    borderColor: Color.secoundaryBtnColor,
    borderWidth: 3,
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    // left: 16,
    alignSelf: "center",
    alignContent: "center",
    zIndex: 1,
    // marginBottom: 20,

    // paddingBottom:20
    // position: "absolute",
  },
});

export default SecoundaryHeader;
