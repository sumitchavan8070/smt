import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import React from "react";
import { Color, FontSize } from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const CategoryComponent = ({ mainCatName, linkName, handleLinkText }) => {
  return (
    <View style={[styles.main]}>
      <Text style={[styles.catname]}>{mainCatName}</Text>
      <Pressable onPress={handleLinkText}>
        <Text style={styles.viewAll}>{linkName}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: "5%",
    width: "95%",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    // backgroundColor: Color.green,
    alignSelf: "center",
  },
  catname: {
    color: Color.colorBlack,
    textAlign: "center",
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
  },
  viewAll: {
    fontSize: FontSize.size_sm,
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.primaryColor,
    textAlign: "center",
  },
});

export default CategoryComponent;
