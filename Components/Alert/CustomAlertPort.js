import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Border, Color, FontSize, Padding } from "../../GlobalStyles";

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
          <TouchableOpacity style={[styles.btnSummary]} onPress={onYes}>
            <Text style={styles.txtSummary}>Okay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "10%",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 9999, // Higher zIndex to ensure it appears above other components
    // borderRadius: 10,
  },
  alert: {
    width: "80%", // Adjust width for portrait orientation
    height: "50%",
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10, // Add some space between text and buttons
  },
  button: {
    flex: 1, // Use flex to evenly space buttons
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
  btnSummary: {
    backgroundColor: Color.primaryColor,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: 13,
  },
  txtSummary: {
    fontSize: FontSize.size_xs,
    textTransform: "capitalize",
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.colorWhite,
    textAlign: "center",
  },
});

export default CustomAlert;
