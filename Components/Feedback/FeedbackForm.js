import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Color } from "../../GlobalStyles"; // Assuming you have a GlobalStyles file
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Import MaterialCommunityIcons
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingAnimation from "../Loader/loader";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // Initialize rating state with 0
  const [loading, setLoading] = useState(false);

  const icons = [
    "alarm-light-outline",
    "alarm-light-outline",
    "alarm-light-outline",
    "alarm-light-outline",
    "alarm-light-outline",
  ];

  const filledIcons = [
    "alarm-light",
    "alarm-light",
    "alarm-light",
    "alarm-light",
    "alarm-light",
  ];

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // console.log("===> Rating" + newRating);
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Error", "Please rate us using the icons.");
      return;
    }

    if (feedback.trim() === "") {
      Alert.alert("Error", "Please enter your feedback.");
    } else {
      setLoading(true);
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userid = loginData.user._id;
      await axios
        .post("/feedback/create", {
          feedback,
          rating,
          userid,
        })
        .then((response) => {
          setLoading(false);

          Alert.alert("Success", "Thank you for your feedback!");
          setFeedback(""); // Clear feedback input after submission
          setRating(0);
        })
        .catch((error) => {
          setLoading(false);

          Alert.alert(
            "Error",
            "Failed to submit feedback. Please try again later."
          );
        });
    }
  };

  const handleFeedbackChange = (text) => {
    setFeedback(text);
  };

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Feedback Form</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rate Us:</Text>
          {/* {icons.map((icon, index) => (
          <TouchableOpacity
            key={index} // Use the index as the key
            style={[
              styles.ratingButton,
              index < rating && styles.selectedRating,
            ]}
            onPress={() => handleRatingChange(index + 1)}
          >
            <MaterialCommunityIcons name={icon} size={24} color="black" />
          </TouchableOpacity>
        ))} */}
          {icons.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.ratingButton,
                index < rating && styles.selectedRating, // Update color based on rating
              ]}
              onPress={() => handleRatingChange(index + 1)}
            >
              {index < rating ? (
                <MaterialCommunityIcons
                  name={filledIcons[index]}
                  size={30}
                  color={Color.extraRed}
                />
              ) : (
                //unselcted
                <MaterialCommunityIcons
                  name={icon}
                  size={30}
                  color={Color.primaryColor}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your feedback here..."
          value={feedback}
          onChangeText={(text) => setFeedback(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>Instructions:</Text>
        <Text style={styles.point}>1. Requesting Question Papers:</Text>
        <Text style={styles.bullet}>
          - Students can request any question paper they need by filling out
          this form.
        </Text>
        <Text style={styles.bullet}>
          - Please specify the category, subcategory, and year of the question
          paper you require.
        </Text>
        <Text style={styles.point}>2. Asking Questions:</Text>
        <Text style={styles.bullet}>
          - Feel free to ask any questions or seek clarification on any topic
          related to our services or products.
        </Text>
        <Text style={styles.point}>
          3. Providing Suggestions for Improvement:
        </Text>
        <Text style={styles.bullet}>
          - Your feedback is valuable! If you have any suggestions for how we
          can improve our services or features, please let us know.
        </Text>
        <Text style={styles.encourageText}>
          We highly encourage you to share your feedback with us. Your input
          helps us enhance our offerings and provide a better experience for
          you.
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  ratingText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingButton: {
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: Color.primaryBtnColor,
    marginRight: 10,
  },
  selectedRating: {
    // backgroundColor: Color.primaryColor,
    color: Color.primaryColor,
  },
  selectedRatingText: {
    color: Color.colorWhite,
  },
  ratingButtonText: {
    color: Color.primaryColor,
    fontWeight: "bold",
  },
  encouragement: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  encourageText: {
    marginTop: 10,
    marginBottom: 20,
  },
  instructions: {
    marginBottom: 10,
    marginTop: 20,
    color: Color.primaryColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  point: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Color.colorWhite,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Color.primaryColor,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    minHeight: 150, // Set a minimum height for the input
  },
  button: {
    backgroundColor: Color.primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
});

export default FeedbackForm;
