// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import React, { useMemo } from "react";
// import { Color, Border, FontSize } from "../../GlobalStyles";

// const getStyleValue = (key, value) => {
//   if (value === undefined) return;
//   return { [key]: value === "unset" ? undefined : value };
// };

// const PrimaryButton = ({ buttonTitle, handleOnSubmit, loading }) => {
//   return (
//     <TouchableOpacity
//       style={[styles.primarybtnLayout]}
//       onPress={handleOnSubmit}
//     >
//       <Text style={[styles.btnText]}>
//         {loading ? "Please Wait .." : buttonTitle}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   primarybtnLayout: {
//     backgroundColor: Color.primaryColor,
//     alignSelf: "center",
//     justifyContent: "center",
//     height: 50,
//     width: "80%",
//     alignContent: "center",
//     borderRadius: Border.br_31xl,
//     //     backgroundColor: Color.primaryColor,
//     shadowColor: "rgba(0, 0, 0, 0.25)",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowRadius: 4,
//     elevation: 4,
//     shadowOpacity: 1,
//     marginVertical: 20,
//   },
//   btnText: {
//     color: Color.colorWhite,
//     alignSelf: "center",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
// });
// export default PrimaryButton;
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Color, Border, FontSize } from "../../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

const PrimaryButton = ({ buttonTitle, handleOnSubmit, loading }) => {
  return (
    <TouchableOpacity
      style={[styles.primarybtnLayout]}
      onPress={handleOnSubmit}
    >
      <LinearGradient
        colors={["#4e54c8", "#8f94fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      <Text style={[styles.btnText]}>
        {loading ? "Please Wait .." : buttonTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primarybtnLayout: {
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
    marginVertical: 20,
    overflow: "hidden", // Ensure the gradient doesn't overflow the button
  },
  gradient: {
    borderRadius: Border.br_31xl,
  },
  btnText: {
    color: Color.colorWhite,
    alignSelf: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    position: "absolute", // Position text on top of the gradient
  },
});
export default PrimaryButton;
