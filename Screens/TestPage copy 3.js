import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { Border, Color, FontSize, Padding } from "../GlobalStyles";
import PrimaryButton from "../Components/Forms/PrimaryButton";
import CustomAlert from "../Components/Alert/CustomAlert";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const TestPage = ({ route }) => {
  const navigation = useNavigation();

  const {
    questionData,
    testId,
    selectedExamCategory,
    selectedSubExamType,
    selectedExamYear,
  } = route.params;

  // console.log("............---........ " + JSON.stringify(questionData));

  const [questionPaper, setQuestionPaper] = useState([]);
  const currentQuestion = questionData[currentQuestionIndex];
  const [selectedOptions, setSelectedOptions] = useState({});
  const selectedOptionKey = selectedOptions[currentQuestionIndex];
  const [selectedQuestionCircle, setSelectedQuestionCircle] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);
  const [timer, setTimer] = useState({ hours: 0, minutes: 60, seconds: 0 });
  const [timerRunning, setTimerRunning] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert
  const [totalTime, setTotalTime] = useState(false); // State to control the visibility of the custom alert
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedQuestionCircle(index);
  };

  const handleOptionClick = (optionKey) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionKey,
    }));

    if (optionKey !== null) {
      setAnsweredQuestions((prevCount) => prevCount + 1);
    } else {
      setAnsweredQuestions((prevCount) => prevCount - 1); // Decrement answered count if option is unselected
    }
    setSelectedQuestionCircle(currentQuestionIndex); // Reset selected question circle
  };

  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        if (timer.minutes === 0 && timer.seconds === 0) {
          clearInterval(interval);
          setTimerRunning(false);
          Alert.alert("Time Up!", "The timer limit has been reached.", [
            { text: "OK", onPress: () => handleYesButton() },
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
    console.log("Timer limit reached");
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    Alert.alert("Time Taken", `Time taken: ${60 - timer.minutes} minutes`, [
      { text: "OK", onPress: () => console.log("Timer stopped") },
    ]);
  };

  // Function to save test data to AsyncStorage
  const saveTestData = async (testData) => {
    try {
      const jsonTestData = JSON.stringify(testData);
      await AsyncStorage.setItem("testData", jsonTestData);
      // console.log("Test data saved successfully" + jsonTestData);
    } catch (error) {
      console.error("Error saving test data:", error);
    }
  };

  const handleTestSubmitBtn = async () => {
    setTimerRunning(false);
    console.log(timer.minutes);
    const timeTaken = 60 - timer.minutes; // Calculate the time taken by subtracting remaining time from total time
    setTotalTime(timeTaken);
    setShowAlert(true); // Show the custom alert when the Submit button is clicked
  };

  // Inside the custom alert handler for the "Yes" button
  const handleYesButton = async () => {
    const currentTime = new Date().getTime().toString(); // Get current time as a string
    const solvedTest = {
      selectedOptions,
      questionData,
      totalTime,
      timestamp: currentTime, // Add timestamp to the test entry
    };

    try {
      await AsyncStorage.setItem(
        `solvedTest_${currentTime}`,
        JSON.stringify(solvedTest)
      );
      // console.log("Test entry saved successfully:", testEntry);
    } catch (error) {
      console.error("Error saving test entry:", error);
    }

    setShowAlert(false); // Hide the custom alert
    navigation.navigate("TestResult", {
      selectedOptions,
      questionData,
      totalTime,
    }); // Navigate to the test result page
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const panX = useRef(new Animated.Value(0)).current;

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX } }],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const swipeX = event.nativeEvent.translationX;

      if (swipeX > 50 && currentQuestionIndex > 0) {
        handlePreviousQuestion();
      } else if (
        swipeX < -50 &&
        currentQuestionIndex < questionData.length - 1
      ) {
        handleNextQuestion();
      }

      Animated.timing(panX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureStateChange}
      >
        <Animated.View style={styles.mainCanvas}>
          <CustomAlert
            alertText="Are you Sure? Want to Exit Test"
            visible={showAlert} // Pass the visibility state to the custom alert component
            onClose={() => {
              setShowAlert(false);
              setTimerRunning(true);
            }} // Function to close the alert
            onYes={async () => {
              // setShowAlert(false); // Close the alert
              handleYesButton();
            }}
          />
          <View style={styles.header}>
            <View style={styles.lables}>
              <Text style={styles.labelText}>{currentQuestionIndex + 1} :</Text>
              <Text style={styles.labelTextValue}> {questionData.length}</Text>
            </View>
            <View style={styles.lables}>
              <Text style={styles.labelText}>ExamID :</Text>
              <Text style={styles.labelTextValue}> {testId}</Text>
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

                {[1, 2, 3, 4].map((optionIndex, arrayIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    onPress={() => handleOptionClick(`option${optionIndex}`)}
                    style={[
                      styles.optionBorder,
                      selectedOptionKey === `option${optionIndex}` &&
                        styles.selectedOption,
                      arrayIndex === 3 && {
                        marginTop: 10,
                        marginBottom: "30%",
                      }, // Add margin to the fourth option
                    ]}
                  >
                    <Text>{currentQuestion[`option${optionIndex}`]}</Text>
                  </TouchableOpacity>
                ))}
                {/* </View> */}
              </View>
            </ScrollView>

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
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
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
    // marginVertical: "5%", ------------------
    top: "1%",
    marginHorizontal: "1%",
    height: "99%",
    flex: 1,

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
    // height: "12%",
    height: 60,
    justifyContent: "space-between",
    alignContent: "center",
    // alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default TestPage;
