import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Border, Color, FontSize, Padding } from "../GlobalStyles";
import PrimaryButton from "../Components/Forms/PrimaryButton";

const TestPage = () => {
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    };

    lockOrientation();

    return async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };
  }, []);

  return (
    <View style={styles.mainCanvas}>
      <View style={styles.header}>
        <View style={styles.lables}>
          <Text style={styles.labelText}>100 :</Text>
          <Text style={styles.labelTextValue}> 100</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>ExamID :</Text>
          <Text style={styles.labelTextValue}> MPSCGRPB2024</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Total Questions :</Text>
          <Text style={styles.labelTextValue}> 100</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Answered :</Text>
          <Text style={styles.labelTextValue}> 100</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Not Answered :</Text>
          <Text style={styles.labelTextValue}> 100</Text>
        </View>
      </View>

      {/* =========================================================================== Header ========================================================================== */}

      <View style={styles.queCanvas}>
        <ScrollView
          style={styles.questionScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.question}>
            <Text style={[styles.questionText]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum. o
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <View style={styles.options}>
              <View style={[styles.optionBorder, styles.firstOption]}>
                <Text style={[styles.optionTxt]}>
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat
                </Text>
              </View>
              <View style={[styles.optionBorder]}>
                <Text style={[styles.optionTxt]}>Test</Text>
              </View>
              <View style={[styles.optionBorder]}>
                <Text style={[styles.optionTxt]}>Test</Text>
              </View>
              <View style={[styles.optionBorder, styles.lastOption]}>
                <Text style={[styles.optionTxt]}>Test</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <ScrollView style={styles.sideDrawerScroll}>
          <Text>10</Text>
        </ScrollView>
      </View>

      {/* =========================================================================== Footer ========================================================================== */}

      <View style={styles.footer}>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Time Left :</Text>
          <Text style={styles.labelTextValue}> 00 : 00 : 00</Text>
        </View>

        <TouchableOpacity style={[styles.button, styles.submitBtn]}>
          <Text style={styles.btnTxt}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.preBtn]}>
          <Text style={styles.btnTxt}>Privious</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.nxtBtn]}>
          <Text style={styles.btnTxt}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  firstOption: {
    marginTop: "10%",
  },
  lastOption: {
    marginBottom: "25%",
  },
  queCanvas: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    // backgroundColor: Color.primaryColor,
    alignItems: "center",
  },
  sideDrawerScroll: {
    height: "100%",
    backgroundColor: Color.green,
    width: "25%",
    marginHorizontal: "2%",
  },
  questionScroll: {
    height: "100%",
    // backgroundColor: Color.colorGray,
    width: "45%",
  },

  questionText: {
    // left: 32,
    // fontFamily: FontFamily.robotoRegular,
    width: "90%",
    // top: 0,
    // position: "relative",
  },
  question: {
    height: "100%",
    // width: 451,
    width: "100%",
    left: "5%",
    top: "1%",
  },
  optionBorder: {
    padding: Padding.p_3xs,
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderStyle: "solid",
    width: "90%",
    borderRadius: Border.br_3xs,
    // alignItems: "center",
    // flexDirection: "row",
    backgroundColor: Color.secoundaryBtnColor,
    // left: 0,
    // position: "absolute",
    marginBottom: 10,
    marginTop: 10,
    // overflow: "visible",
  },
  optionTxt: {
    textAlign: "left",
    color: Color.colorBlack,
    textTransform: "capitalize",
    fontSize: FontSize.size_xs,
  },

  options: {
    // height: 200,
    // marginTop: 20,
    // width: 451,
    // display: "flex",
    // flexDirection: "column",
    // marginBottom: 10,
    // alignSelf: "center",
    // alignItems: "center",
  },

  mainCanvas: {
    backgroundColor: Color.colorWhite,
    marginVertical: "5%",
    marginHorizontal: "1%",
    height: "89%",
    // bottom: 0,
  },

  header: {
    backgroundColor: Color.secoundaryBtnColor,
    display: "flex",
    flexDirection: "row",
    height: "10%",
    justifyContent: "space-between",
  },
  lables: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  },
  labelText: {
    fontWeight: "bold",
  },
  labelTextValue: {
    // color: Color.primaryColor,
    fontWeight: "bold",
  },

  button: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 5,
  },
  submitBtn: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  preBtn: {
    backgroundColor: Color.yellow,
    borderRadius: Border.br_3xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  nxtBtn: {
    backgroundColor: Color.primaryColor,
    borderRadius: Border.br_3xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  btnTxt: {
    color: Color.colorWhite,
  },
  footer: {
    backgroundColor: Color.secoundaryBtnColor,
    display: "flex",
    flexDirection: "row",
    height: "12%",
    justifyContent: "space-between",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default TestPage;
