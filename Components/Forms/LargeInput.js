import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useMemo, memo } from "react";
import { Color, Border, Padding, FontSize } from "../../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

const LargeInput = ({
  inputPlaceholderText,
  inputLabel,
  propTop,
  keyboardType,
  autoComplete,
  // By Defalut Making Proerty False Because we will use in passowrd as well
  secureTextEntry = false,

  // Value and Set Value Dynamic from Register Screen
  value,
  setValue,
}) => {
  // const emailInputStyle = useMemo(() => {
  //   return {
  //     ...getStyleValue("top", propTop),
  //   };
  // }, [propTop]);

  return (
    // Dynamically Getting Input Box Values

    <View style={[styles.emailInput, styles.inputFlexBox]}>
      {/* <TextInput
        style={[styles.emailPlaceholder, styles.emailTypo]}
        autoCorrect={false}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        secureTextEntry={secureTextEntry}
        //value ... from input box
        value={value}
        onChangeText={(text) => setValue(text)}
        placeholder={inputPlaceholderText}
      ></TextInput> */}
      <TextInput
        style={[styles.emailPlaceholder, styles.emailTypo]}
        autoCorrect={false}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={(text) => setValue(text)}
        placeholder={inputPlaceholderText}
        multiline={true} // Enable multiline input
        autoFocus={true} // Autofocus on the input
        textAlignVertical="top" // Align text to the top
      ></TextInput>

      {/* <Image
        style={styles.checkIcon}
        contentFit="cover"
        source={require("../../assets/check.png")}
      /> */}
      <View style={[styles.inputLable, styles.inputFlexBox]}>
        <Text style={[styles.email, styles.emailTypo]}>{inputLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputFlexBox: {
    flexDirection: "row",
    // position: "absolute",
    alignItems: "center",
  },
  emailPlaceholder: {
    // fontWeight: "200",
    // fontFamily: FontFamily.interExtraLight,
    color: Color.colorBlack,
    textAlign: "left",
    display: "flex",
    width: 268,
    // height: 28,
    zIndex: 0,
    fontSize: FontSize.size_base,
    alignItems: "center",
  },
  checkIcon: {
    width: 25,
    height: 25,
    overflow: "hidden",
    zIndex: 1,
  },
  email: {
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.primaryColor,
    textAlign: "center",
    fontSize: FontSize.size_xs,
  },
  inputLable: {
    top: -10,
    left: 18,
    backgroundColor: Color.colorWhite,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    zIndex: 2,
    alignItems: "center",
    position: "absolute",
  },
  emailInput: {
    // top: 220,
    // left: 41,
    // left: 25,
    borderRadius: Border.br_11xl,
    borderStyle: "solid",
    borderColor: Color.primaryColor,
    borderWidth: 1,
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_mini,
    alignItems: "center",
    marginVertical: 20,
    width: "90%",
    alignSelf: "center",
    height: 200,
  },
});

export default LargeInput;
