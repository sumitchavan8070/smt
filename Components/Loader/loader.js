import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/loader.json";
import { Color } from "../../GlobalStyles";

const LoadingAnimation = ({ visible, loop }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <LottieView
          source={loadingAnimation} // Replace with your animation JSON file
          autoPlay
          loop={loop}
          style={styles.animation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Adjust opacity as needed
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensure the loading animation is on top
    // bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default LoadingAnimation;
