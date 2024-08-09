import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Color, Border, FontSize } from "../../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

const SecoundaryButton = ({ buttonTitle, handleOnSubmit }) => {
  return (
    <TouchableOpacity
      style={[styles.secoundbtnLayout]}
      onPress={handleOnSubmit}
    >
      <Text style={[styles.secoundBtnText]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secoundbtnLayout: {
    backgroundColor: Color.secoundaryBtnColor,
    alignSelf: "center",
    justifyContent: "center",
    height: 50,
    width: "80%",
    alignContent: "center",
    borderRadius: Border.br_31xl,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    marginVertical: 10,
  },
  secoundBtnText: {
    color: Color.primaryColor,
    alignSelf: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default SecoundaryButton;
