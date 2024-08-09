import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/review.json";
import { Color } from "../../GlobalStyles";

const PostAlert = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={loadingAnimation} // Replace with your animation JSON file
          autoPlay
          loop={true}
          style={styles.animation}
        />
        <Text style={styles.message}>
          {/* Thanks for posting! Our team will review your post soon. */}
          {message}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: "70",
    height: "70%",
    alignSelf: "center",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensure the alert card is on top
  },
  card: {
    backgroundColor: Color.colorWhite,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Add elevation for Android shadow
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: "10%",
    color: Color.primaryColor,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#6949ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PostAlert;
