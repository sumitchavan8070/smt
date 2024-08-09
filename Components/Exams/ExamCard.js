import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Border, Color, FontSize } from "../../GlobalStyles";
import { Image } from "expo-image";

const ExamCard = ({ item }) => {
  const navigation = useNavigation();

  const handleMoreButton = (_id) => {
    navigation.navigate("ExamDetail", { _id: _id });
    //   console.log(_id);
  };

  return (
    <View key={item?._id} style={styles.main}>
      <TouchableOpacity
        style={styles.catContainer}
        onPress={() => handleMoreButton(item._id)}
      >
        <View style={[styles.card]}>
          <Image
            style={[styles.upperCardBlock, styles.cardPosition]}
            contentFit="cover"
            source={{ uri: item?.image }}
          />
          <View style={[styles.lowerCardBlock, styles.cardPosition]} />
          <Text style={styles.maharastraPublicService}>{item?.catName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {},
  container: {
    backgroundColor: "#ffffff",
    padding: 5,
    flexDirection: "row",
    top: "30%",
  },
  catContainer: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  catIcon: {
    fontSize: 30,
    verticalAlign: "top",
  },
  catTitle: {
    fontSize: 12,
  },

  cardPosition: {
    left: "0%",
    right: "0%",
    width: "100%",
    position: "absolute",
  },
  upperCardBlock: {
    height: "64.42%",
    top: "0%",
    bottom: "35.58%",
    borderTopLeftRadius: Border.br_11xl,
    borderTopRightRadius: Border.br_11xl,
    backgroundColor: Color.colorGray,
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    borderColor: Color.primaryColor,
    borderWidth: 0.2,
  },
  lowerCardBlock: {
    height: "35.58%",
    top: "64.42%",
    bottom: "0%",
    borderBottomRightRadius: Border.br_xl,
    borderBottomLeftRadius: Border.br_xl,
    backgroundColor: Color.secoundaryBtnColor,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
  },
  maharastraPublicService: {
    width: "91.27%",
    top: "71.15%",
    left: "8.73%",
    fontSize: FontSize.size_xs,
    textTransform: "capitalize",
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.colorBlack,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    position: "absolute",
  },
  card: {
    width: 229,
    height: 208,
  },
});
export default ExamCard;
