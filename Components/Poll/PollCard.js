import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import confettiAnimation from "../../assets/confitee.json";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Color } from "../../GlobalStyles";

const PollCard = ({ poll, postId, approvedPolls }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  // const [totalVotes, setTotalVotes] = useState(
  //   poll.votes ? Object.keys(poll.votes).length : 0
  // );
  const [totalVotes, setTotalVotes] = useState(
    poll.votes ? Object.keys(poll.votes).length : 0
  );
  const [optionVotes, setOptionVotes] = useState({});
  const [percentageVotes, setPercentageVotes] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (approvedPolls.polls[0].postedBy && !user) {
      fetchCurrentUser();
      fetchUserById(approvedPolls.polls[0].postedBy);
    }
  }, [approvedPolls]);

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`/${userId}`);
      setUser(response.data.user);
      // console.log("user data in poll" + response.data.user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;
      if (userId) {
        setUser(userId);
        const userVote = Object.keys(poll.votes).find((key) => key === userId);
        setSelectedOption(userVote ? poll.votes[userVote] : null);
        // console.log("User Vote :" + userVote);

        // if (userVote !== undefined) {
        //   setSelectedOption(poll.votes[userVote]);
        //   console.log("User Vote :" + JSON.stringify(selectedOption));
        // } else {
        //   console.log("No option is selected by the user.");
        //   setSelectedOption(null);
        // }

        // // setSelectedOption(poll.votes[userVote]);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let userId = loginData.user._id;
    try {
      const response = await axios.put(`/${postId}`, {
        option,
        userId,
      });

      // console.log("Vote response:", response.data);
      const totalVotes = Object.keys(response.data.poll.votes).length;
      setTotalVotes(totalVotes); // Increment totalVotes locally
      const newVotes = {};
      const newPercentages = {};

      Object.entries(response.data.poll.votes).forEach(([userId, vote]) => {
        // Count the number of votes for each option
        response.data.poll.options.forEach((opt) => {
          if (vote === opt) {
            newVotes[opt] = (newVotes[opt] || 0) + 1;
          }
        });
      });

      // Calculate percentages based on the updated totalVotes
      response.data.poll.options.forEach((opt) => {
        newPercentages[opt] = `${((newVotes[opt] || 0) / totalVotes) * 100}%`;
        // newPercentages[opt] = `${(
        //   ((newVotes[opt] || 0) / totalVotes) *
        //   100
        // ).toFixed(2)}%`;
      });

      // console.log("totalVotes :" + JSON.stringify(totalVotes));

      setOptionVotes(newVotes);
      setPercentageVotes(newPercentages);
      setShowConfetti(true);
      // console.log("Percentage :" + JSON.stringify(newPercentages));
      // console.log("Votes :" + JSON.stringify(newVotes));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* <View style={styles.userInfo}>
          <Image
            style={styles.userProfileImage}
            source={{ uri: user?.profilePic }}
          />
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.spon}>Sponsored</Text>
          </View>
        </View> */}
        <View style={styles.userInfo}>
          <Image
            style={styles.userProfileImage}
            source={{ uri: user?.profilePic }}
          />
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            {/* //ToDo , we havent added isSponsored in the Model */}
            {poll.isSponsored && (
              <Text style={styles.sponsoredText}>Sponsored</Text>
            )}
          </View>
        </View>

        <Text style={styles.question}>{poll.question}</Text>
        <ScrollView style={styles.optionsContainer}>
          {poll.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              {selectedOption === option && (
                <FontAwesome5
                  name="check-circle"
                  size={20}
                  color={selectedOption === poll.answer ? "green" : "red"}
                  style={styles.checkIcon}
                />
              )}
              <Text>{option}</Text>
              <Text style={styles.percentageText}>
                {selectedOption !== null &&
                (optionVotes[option] || percentageVotes[option])
                  ? `${percentageVotes[option] || "0%"} (${
                      optionVotes[option] || 0
                    } votes)`
                  : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Bottom icons */}
        <View style={styles.iconContainer}>
          <View style={styles.rightIcons}>
            {/* <TouchableOpacity style={styles.iconButton}>
              <FontAwesome
                name="heart-o"
                size={24}
                color={Color.primaryColor}
              />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity style={styles.bookmarkButton}>
            <FontAwesome
              name="bookmark-o"
              size={24}
              color={Color.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showConfetti && (
        <View style={styles.confettiContainer}>
          <View style={styles.votesContainer}>
            <Text>Total Votes: {totalVotes}</Text>
          </View>
          <LottieView
            source={confettiAnimation}
            autoPlay
            loop={false}
            style={styles.animation}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rightIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginHorizontal: 10,
  },
  bookmarkButton: {
    padding: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  userName: {
    marginRight: 10,
    fontSize: 14,
  },
  spon: { fontSize: 12 },
  userProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  container: {
    position: "relative", // Ensure proper positioning of the confetti animation
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    // top: "10%",
    marginVertical: 10,
  },
  question: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
    borderColor: "#6949ff",
  },
  checkIcon: {
    marginRight: 5,
  },
  percentageText: {
    marginLeft: 10,
    color: "#555",
  },
  votesContainer: {
    // alignItems: "center",
    alignSelf: "center",
    // marginTop: 10,
    bottom: 0,
    marginVertical: 10,
    paddingVertical: 15,
    position: "absolute",
  },
  confettiContainer: {
    position: "absolute", // Position the confetti container absolutely
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    pointerEvents: "none",
    height: 150,
    width: "95%",
  },
});

export default PollCard;
