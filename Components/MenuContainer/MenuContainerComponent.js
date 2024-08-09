import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Color } from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const MenuContainerComponent = () => {
  const navigation = useNavigation();

  const handleGroupPress = () => {
    navigation.navigate("CommonScreen");
  };
  // const handleLeaderboardPress = () => {
  //   navigation.navigate("LeaderboardPage");
  // };
  const handleTestResultsPress = () => {
    navigation.navigate("History");
  };
  const handleCreateTestPress = () => {
    navigation.navigate("CustomTestPage");
  };
  const handleTakeTestPress = () => {
    navigation.navigate("FilterExam");
  };
  const handleFeedbackPress = () => {
    navigation.navigate("FeedbackForm");
  };
  // const handleWinRewardPress = () => {
  //   navigation.navigate("CommonScreen");
  // };
  const handleDonatePress = () => {
    navigation.navigate("Test");
  };

  const handleSubClick = () => {
    navigation.navigate("Profile");
  };

  const handleSeeting = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.main}>
      {/* <Text>Menu</Text> */}

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleCreateTestPress}
        >
          <Ionicons
            name="create"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Create Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleTakeTestPress}>
          <FontAwesome
            name="newspaper-o"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Take Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleGroupPress}>
          <FontAwesome
            name="group"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Community</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleLeaderboardPress}
        >
          <MaterialIcons
            name="leaderboard"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Leaderboard</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleTestResultsPress}
        >
          <FontAwesome5
            name="history"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleFeedbackPress}>
          <MaterialIcons
            name="support-agent"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Feedback</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconBtn} onPress={handleWinRewardPress}>
          <FontAwesome
            name="trophy"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Win Reward</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleDonatePress}>
          <FontAwesome5
            name="hand-holding-heart"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Donate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleSubClick}>
          <MaterialIcons
            name="attach-money"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Pricing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleSeeting}>
          <AntDesign
            name="setting"
            style={[styles.icon]}
            color={Color.primaryColor}
          />
          <Text>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { fontSize: 25 },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    padding: 10,
  },
  main: {
    backgroundColor: Color.secoundaryBtnColor,
    paddingVertical: 10,
  },
  iconBtn: {
    alignItems: "center",
    // flexDirection: "row",
    gap: 5,
    marginVertical: 10,
    width: "25%", // Adjust the width to fit four items in a row with spacing
    // padding: 10,
    borderRadius: 5,
    // marginHorizontal: 10,
    backgroundColor: Color.lightGray, // Add background color for better visibility
  },
});

export default MenuContainerComponent;
