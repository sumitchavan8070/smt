import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Color } from "../GlobalStyles";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get("/leaderboard/getall"); // Adjust the endpoint as per your API
      const sortedData = response.data.sort((a, b) => b.score - a.score); // Sort users based on score in descending order
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.indexNo}>{index + 1}</Text>
      {item.profilePic ? (
        <Image source={item.profilePic} style={styles.profilePic} />
      ) : (
        <FontAwesome5
          name="user-circle"
          size={40}
          // style={styles.defaultProfilePic}
          style={[
            styles.memberProfileIcon,
            { color: colorTray[index % colorTray.length] },
          ]}
        />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  const handleCreateDummyUser = async () => {
    try {
      const data = await AsyncStorage.getItem("@auth");

      const loginData = JSON.parse(data);
      const fetchedUsername = loginData.user.name;
      const fetchedname = loginData.user.username;

      const response = await axios.post("/leaderboard/create", {
        username: fetchedname,
        name: fetchedUsername,
        location: "Dummy Location",
        score: 250, // Set an initial score for the dummy user
      });
      Alert.alert("Success", response.data.message);
      fetchLeaderboardData();
    } catch (error) {
      Alert.alert("Error", "Unable to create dummy user.");
    }
  };

  return (
    <View style={styles.container}>
      {leaderboardData.length === 0 ? (
        <View>
          <Text style={styles.noUsersText}>
            No users found in the leaderboard.
          </Text>
          <Button title="Create Dummy User" onPress={handleCreateDummyUser} />
        </View>
      ) : (
        <View>
          <View>
            <FlatList
              // data={leaderboardData}
              data={leaderboardData.slice(0, 10)} // Display only the top 5 users
              keyExtractor={(item) => item._id.toString()}
              renderItem={renderLeaderboardItem}
              contentContainerStyle={styles.flatListContent}
            />

            <Button title="Create Dummy User" onPress={handleCreateDummyUser} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indexNo: {
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Color.colorWhite,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Color.primaryColor,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flatListContent: {
    flexGrow: 1,
  },
  noUsersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: Color.textColor,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultProfilePic: {
    fontSize: 40,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  username: {
    fontSize: 12,
    marginHorizontal: 20,
  },
  name: {
    fontSize: 16,
    color: Color.colorBlack,
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  score: {
    fontSize: 16,
    // fontWeight: "bold",
  },
});

export default LeaderboardPage;
