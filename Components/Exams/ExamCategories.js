import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { examData } from "../../data/CategoriesData";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Border, Color, FontSize } from "../../GlobalStyles";
import { Image } from "expo-image";

const Categories = () => {
  const navigation = useNavigation();
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      //alwaysBounceVertical={false}
      //bounces={false}
    >
      <View style={styles.container}>
        {examData?.map((item) => (
          <View key={item._id}>
            <TouchableOpacity
              style={styles.catContainer}
              onPress={() => navigation.navigate(item.path)}
            >
              <View style={[styles.card]}>
                <Image
                  style={[styles.cardChild, styles.cardPosition]}
                  contentFit="cover"
                  source={{ uri: item.catImgUri }}
                />
                <View style={[styles.cardItem, styles.cardPosition]} />
                <Text style={styles.maharastraPublicService}>
                  {/* Maharastra Public Service Commision */}
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  cardChild: {
    height: "64.42%",
    top: "0%",
    bottom: "35.58%",
    borderTopLeftRadius: Border.br_11xl,
    borderTopRightRadius: Border.br_11xl,
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
  },
  cardItem: {
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
    textTransform: "uppercase",
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
export default Categories;
