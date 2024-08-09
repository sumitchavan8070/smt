import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({
  visible,
  onClose,
  onYes,
  alertText,
  showSingleButton,
}) => {
  if (!visible) {
    return null; // Return null if the alert is not visible
  }

  return (
    <View style={styles.container}>
      <View style={styles.alert}>
        <Text style={styles.alertText}>{alertText}</Text>
        {!showSingleButton ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={onYes}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.yesButton]}
            onPress={onYes}
          >
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 9999, // Higher zIndex to ensure it appears above other components
  },
  alert: {
    width: "50%",
    height: "30%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    width: "40%",
    height: 40,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  yesButton: {
    backgroundColor: "green",
  },
  noButton: {
    backgroundColor: "red",
  },
});

export default CustomAlert;
