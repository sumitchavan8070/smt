import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Border, Color, FontSize, Padding } from "../GlobalStyles";
import PrimaryButton from "../Components/Forms/PrimaryButton";
import CustomAlert from "../Components/Alert/CustomAlert";
import { useNavigation } from "@react-navigation/native";

const TestPage = ({ route }) => {
  const navigation = useNavigation();

  const { questionData } = route.params;

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // setSelectedOptionIndex(null); // Reset selected option when changing question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // setSelectedOptionIndex(null); // Reset selected option when changing question
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    // setSelectedOptionIndex(null); // Reset selected option when changing question
    setSelectedQuestionCircle(index);
  };

  //working upto question number circle background
  // const handleOptionClick = (optionKey) => {
  //   setSelectedOptions((prevSelectedOptions) => ({
  //     ...prevSelectedOptions,
  //     [currentQuestionIndex]: optionKey,
  //   }));
  // };

  const handleOptionClick = (optionKey) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionKey,
    }));

    // Update answered or unanswered questions count
    if (optionKey !== null) {
      setAnsweredQuestions((prevCount) => prevCount + 1);
    } else {
      setAnsweredQuestions((prevCount) => prevCount - 1); // Decrement answered count if option is unselected
    }
    setSelectedQuestionCircle(currentQuestionIndex); // Reset selected question circle
    // Only update selected question circle if it's not already set
    // if (selectedQuestionCircle === null) {
    //   setSelectedQuestionCircle(currentQuestionIndex); // Update selected question circle
    // }
  };

  // const handleOptionClick = (optionIndex) => {
  //   setSelectedOptionIndex(optionIndex);
  // };

  // const totalQuestions = questionData.length;
  // let ans = totalQuestions - answeredQuestions;
  // setUnansweredQuestions(ans);

  const currentQuestion = questionData[currentQuestionIndex];
  const [selectedOptions, setSelectedOptions] = useState({});
  const selectedOptionKey = selectedOptions[currentQuestionIndex];
  const [selectedQuestionCircle, setSelectedQuestionCircle] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);
  const [timer, setTimer] = useState({ hours: 0, minutes: 1, seconds: 0 });
  const [timerRunning, setTimerRunning] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert

  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        if (timer.minutes === 0 && timer.seconds === 0) {
          clearInterval(interval);
          setTimerRunning(false);
          Alert.alert("Time Up!", "The timer limit has been reached.", [
            { text: "OK", onPress: () => handleTimeUp() },
          ]);
        } else {
          setTimer((prevTimer) => {
            let updatedTimer = { ...prevTimer };
            if (updatedTimer.seconds === 0) {
              updatedTimer.minutes -= 1;
              updatedTimer.seconds = 59;
            } else {
              updatedTimer.seconds -= 1;
            }
            return updatedTimer;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer, timerRunning]);

  const handleTimeUp = () => {
    // Logic to handle when the timer limit is reached (e.g., end the test)
    // You can add your custom logic here
    console.log("Timer limit reached");
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    Alert.alert("Time Taken", `Time taken: ${60 - timer.minutes} minutes`, [
      { text: "OK", onPress: () => console.log("Timer stopped") },
    ]);
  };

  const handleTestSubmitBtn = () => {
    setTimerRunning(false);
    setShowAlert(true); // Show the custom alert when the Submit button is clicked
  };

  return (
    <View style={styles.mainCanvas}>
      <CustomAlert
        visible={showAlert} // Pass the visibility state to the custom alert component
        onClose={() => {
          setShowAlert(false);
          setTimerRunning(true);
        }} // Function to close the alert
        onYes={async () => {
          setShowAlert(false); // Close the alert
          navigation.navigate("TestResult"); // Navigate to the test result page
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
        }}
      />
      <View style={styles.header}>
        <View style={styles.lables}>
          <Text style={styles.labelText}>{currentQuestionIndex + 1} :</Text>
          <Text style={styles.labelTextValue}> {questionData.length}</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>ExamID :</Text>
          <Text style={styles.labelTextValue}> MPSCGRPB2024</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Total Questions :</Text>
          <Text style={styles.labelTextValue}> {questionData.length}</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Answered :</Text>
          <Text style={styles.labelTextValue}> {answeredQuestions}</Text>
        </View>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Not Answered :</Text>
          <Text style={styles.labelTextValue}>
            {questionData.length - answeredQuestions}
          </Text>
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
              {currentQuestion.question}
            </Text>
            {/* <View style={styles.options}>
              <View style={[styles.optionBorder, styles.firstOption]}>
                <Text style={[styles.optionTxt]}>
                  {currentQuestion.option1}
                </Text>
              </View>
              <View style={[styles.optionBorder]}>
                <Text style={[styles.optionTxt]}>
                  {currentQuestion.option2}
                </Text>
              </View>
              <View style={[styles.optionBorder]}>
                <Text style={[styles.optionTxt]}>
                  {" "}
                  {currentQuestion.option3}
                </Text>
              </View>
              <View style={[styles.optionBorder, styles.lastOption]}>
                <Text style={[styles.optionTxt]}>
                  {" "}
                  {currentQuestion.option4}
                </Text>
              </View>
            </View> */}

            {/* <View style={styles.options}> */}
            {/* {Array.from({ length: 4 }, (_, i) => i + 1).map((index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionClick(index - 1)}
                style={[
                  styles.optionBorder,
                  selectedOptionIndex === index - 1 && styles.selectedOption,
                ]}
              >
                <Text>{currentQuestion[`option${index}`]}</Text>
              </TouchableOpacity>
            ))} */}
            {[1, 2, 3, 4].map((optionIndex, arrayIndex) => (
              <TouchableOpacity
                key={optionIndex}
                onPress={() => handleOptionClick(`option${optionIndex}`)}
                style={[
                  styles.optionBorder,
                  selectedOptionKey === `option${optionIndex}` &&
                    styles.selectedOption,
                  arrayIndex === 3 && { marginTop: 10, marginBottom: "30%" }, // Add margin to the fourth option
                ]}
              >
                <Text>{currentQuestion[`option${optionIndex}`]}</Text>
              </TouchableOpacity>
            ))}
            {/* </View> */}
          </View>
        </ScrollView>
        {/* <ScrollView style={styles.sideDrawerScroll}>
          <View style={styles.questionNumberList}>
            {questionData.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuestionClick(index)}
                style={[
                  styles.circle,
                  selectedQuestionCircle === index && styles.selectedCircle,
                ]}
              >
                <View style={styles.circle}>
                  <Text style={styles.circleText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView> */}

        <ScrollView style={styles.sideDrawerScroll}>
          <View style={styles.questionNumberList}>
            {questionData.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuestionClick(index)}
                style={[
                  styles.circle,
                  // selectedQuestionCircle === index && styles.selectedCircle,
                  selectedOptions[index] !== undefined &&
                    selectedOptions[index] !== null &&
                    styles.selectedCircle,
                  index >= 25 && { marginBottom: "30%" }, // Add marginBottom when index reaches 25
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    selectedOptions[index] !== undefined &&
                      selectedOptions[index] !== null &&
                      styles.selectedCircleText,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* =========================================================================== Footer ========================================================================== */}

      <View style={styles.footer}>
        <View style={styles.lables}>
          <Text style={styles.labelText}>Time Left :</Text>
          <Text style={styles.labelTextValue}>
            {timer.hours} : {timer.minutes} : {timer.seconds}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.submitBtn]}
          onPress={handleTestSubmitBtn}
        >
          <Text style={styles.btnTxt}>Submit</Text>
        </TouchableOpacity>
        {/* Custom Alert Component */}

        <TouchableOpacity
          style={[styles.button, styles.preBtn]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.btnTxt}>Privious</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.nxtBtn]}>
          <Text
            style={styles.btnTxt}
            onPress={handleNextQuestion}
            disabled={currentQuestionIndex === questionData.length - 1}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedCircleText: {
    color: Color.colorWhite,
  },
  selectedCircle: {
    backgroundColor: Color.primaryColor,
    // Color: Color.colorWhite,
  },
  questionNumberList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Color.colorWhite,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  circleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
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
    // bottom: "5%",
    // flexWrap: "wrap",
    // bottom: "100%",
  },
  selectedOption: { borderColor: Color.green },
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
    // paddingVertical: 10,
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
