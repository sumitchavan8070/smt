import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const Watermark = ({ text }) => {
  const watermarkText = `${text}`; // Text for the watermark
  const numColumns = 3; // Number of columns
  const numRows = 3; // Number of rows

  return (
    <View style={styles.container}>
      {[...Array(numColumns).keys()].map((colIndex) => (
        <View key={colIndex} style={styles.column}>
          {[...Array(numRows).keys()].map((rowIndex) => (
            <Text key={`${colIndex}-${rowIndex}`} style={styles.watermarkText}>
              {watermarkText}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row", // Arrange columns horizontally
    // flexWrap: "wrap", // Allow columns to wrap to next row
    justifyContent: "center",
    alignItems: "center",
    zIndex: -11, // Place behind other components
  },
  column: {
    width: 100, // Adjust the width of each column based on your needs
  },
  watermarkText: {
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.07)", // Light gray color
    transform: [{ rotate: "-45deg" }], // Rotate text for a watermark effect
    marginVertical: 12,
  },
});

export default Watermark;
