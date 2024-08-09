import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import InputBox from "../Forms/InputBox";
import { Color } from "../../GlobalStyles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import LoadingAnimation from "../Loader/loader";
import { LinearGradient } from "expo-linear-gradient";
import { setGestureState } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JoinBox = () => {
  const [testId, setTestId] = useState("");
  const [GroupShareId, SetGroupShareId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleTestJoin = () => {
    if (!testId) {
      alert("Please Enter Test Code");
      return;
    }
    setLoading(true);
    getCustomTestById();
  };
  const handleGroupJoin = async () => {
    if (!GroupShareId) {
      alert("Please Enter Group Code");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let username = loginData.user.username;
      let userId = loginData.user._id;
      let name = loginData.user.name;

      let groupShareId = GroupShareId.trim();

      const response = await axios.post("/groups/join-group", {
        GroupShareId: groupShareId,
        userId: userId,
        name: name,
        username: username,
      });

      if (response.data.status === "success") {
        navigation.navigate("GroupDetailPage");
        Alert.alert("Success", "You have successfully joined the group.");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      Alert.alert("Error", error.response?.data?.message || "Server Error");
    }
  };

  const getCustomTestById = async () => {
    try {
      const response = await axios.get(`/customtest/custom-test/${testId}`);
      // const testData = response.data;
      if (response.data) {
        // console.log("Custom test data:", testData);
        const questionData = response.data.data[0].questions;
        // console.log("=====>:", response.data.data[0].testId);
        navigation.navigate("TestPage", {
          questionData,
          testId,
        });
        setLoading(false);
      } else {
        console.log("Custom test not found.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <View style={styles.main}>
        <View style={styles.boxConatiners}>
          {/* <View style={styles.joinTestConatiner}> */}
          {/* <View style={styles.searchContainer}>
            <TextInput
              style={styles.groupInput}
              placeholder="Enter Test Code here"
              value={testId}
              onChangeText={setTestId}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={handleTestJoin}
              style={styles.linkTextButton}
            >
              <Text style={styles.linkText}>Join Test</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.groupInput}
              placeholder="Enter Test Code here"
              value={testId}
              onChangeText={setTestId}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleTestJoin}>
              <LinearGradient
                // colors={["#2196F3", "#1976D2"]}
                colors={["#8f94fb", "#4e54c8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linkTextButton}
              >
                <Text style={styles.linkText}>Join Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.searchContainer}>
            <TextInput
              style={styles.groupInput}
              placeholder="Enter Group Code here"
              value={GroupId}
              onChangeText={setGroupId}
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={handleGroupJoin}
              style={styles.linkTextButton}
            >
              <Text style={styles.linkText}>Join Group</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.groupInput}
              placeholder="Enter Group Code here"
              value={GroupShareId}
              onChangeText={SetGroupShareId}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleGroupJoin}>
              <LinearGradient
                // colors={["#2196F3", "#1976D2"]}
                colors={["#4e54c8", "#8f94fb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linkTextButton}
              >
                <Text style={styles.linkText}>Join Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: Color.secoundaryBtnColor,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
    // backgroundColor: Color.secoundaryBtnColor,
    width: "70%",
    justifyContent: "center",
    alignContent: "center",
  },

  linkTextButton: {
    borderWidth: 0.2,
    borderColor: Color.primaryColor,
    padding: 16,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Color.primaryColor,
  },
  linkText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
  groupInput: {
    width: "80%",
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: Color.primaryColor,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    padding: 9,
    paddingHorizontal: 30,
  },
});

export default JoinBox;
