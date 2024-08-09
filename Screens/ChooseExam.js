// import React, { useEffect, useState } from "react";
// import {
//   ScrollView,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   View,
// } from "react-native";
// import CustomAlert from "../Components/Alert/CustomAlertPort";
// import ChooseExamDropdown from "../Components/Dropdown/ChooseExamDropdown";
// import PrimaryButton from "../Components/Forms/PrimaryButton";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";
// import SecoundaryHeader from "../Components/Menus/SecoundaryHeader";
// import { Color } from "../GlobalStyles";
// import CreateTestPage from "./CreateTestPage";
// import LoadingAnimation from "../Components/Loader/loader";
// import ChooseExamAlert from "../Components/Alert/ChooseExamAlert";
// import ChooseExamAlertSuccess from "../Components/Alert/ChooseExamAlertSuccess";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// const ChooseExam = ({}) => {
//   const Tab = createMaterialTopTabNavigator();
//   const navigation = useNavigation();
//   const route = useRoute(); // Get the route object
//   const { detailPageValue } = route.params || {}; // Destructure _id from params or use an empty object if params is undefined
//   const [selectedExamCategory, setSelectedExamCategory] = useState(
//     detailPageValue && detailPageValue._id ? detailPageValue._id : null // Check if detailPageValue and detailPageValue._id exist before accessing _id
//   );

//   useEffect(() => {
//     if (!detailPageValue || !detailPageValue._id) {
//       setSelectedExamCategory(null); // Update selectedExamCategory to null if detailPageValue or detailPageValue._id is not found
//     }
//   }, [detailPageValue]);

//   const [questionData, setQuestionData] = useState([]);
//   const [testId, setTestId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlertTest, setShowAlertTest] = useState(false);
//   const [alertMessageTest, setAlertMessageTest] = useState("");
//   const [selectedSubExamType, setSelectedSubExamType] = useState("");
//   const [selectedExamYear, setSelectedExamYear] = useState("");
//   const [yearDropIsVisible, setYearDropIsVisible] = useState(true);
//   const [distDropIsVisible, setDistDropIsVisible] = useState(true);

//   const onSubmitChooseExam = async () => {
//     if (!selectedExamCategory) {
//       alert("Please select an exam category");
//       return;
//     }

//     if (!selectedSubExamType) {
//       alert("Please select an exam type");
//       return;
//     }

//     if (yearDropIsVisible && !selectedExamYear) {
//       alert("Please select an exam year");
//       return;
//     }

//     loadQuestionPaper();
//   };

//   const handleOnClose = () => {
//     setShowAlert(false);
//   };

//   const loadQuestionPaper = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "/question-papers/getQuestionPapersByFilter",
//         {
//           catID: selectedExamCategory,
//           subCatID: selectedSubExamType,
//           QPYearID: selectedExamYear,
//         }
//       );
//       const incomingData = response.data.data;
//       const myTestData = incomingData.map(
//         ({ _id, question, option1, option2, option3, option4, answer }) => ({
//           _id,
//           question,
//           option1,
//           option2,
//           option3,
//           option4,
//           answer,
//         })
//       );
//       const dataAuth = await AsyncStorage.getItem("@auth");
//       const loginData = JSON.parse(dataAuth);
//       const creatorId = loginData.user._id;
//       const creatorName = loginData.user.name;
//       const responseMainTest = await axios.post("/question-papers/main-test", {
//         testName: selectedExamCategory,
//         totalQuestions: myTestData.length,
//         passingMarks: 0, // You can set this as required
//         creatorId: creatorId,
//         questions: myTestData,
//       });

//       setQuestionData(responseMainTest.data.data.questions);
//       setTestId(responseMainTest.data.data.testId);
//       // console.log("QuestionPaper Data " + JSON.stringify(data));
//       setShowAlertTest(true);
//       setAlertMessageTest("Quick Tips: There are no Tips. Best of luck!");
//       //===============when we are changing this message please do the changes in papercardcontainer in components question paper section ===
//     } catch (error) {
//       console.error("Error fetching question paper:", error);
//       setShowAlert(true);
//       setAlertMessage(
//         "No question papers are available for the selected options. Please review your selections and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOnInstructions = () => {
//     navigation.navigate("InstructionPage", {
//       questionData,
//       testId,
//       selectedExamCategory,
//       selectedSubExamType,
//       selectedExamYear,
//     });
//   };

//   const handleOnSkipIntructions = () => {
//     navigation.navigate("TestPage", {
//       questionData,
//       testId,
//       selectedExamCategory,
//       selectedSubExamType,
//       selectedExamYear,
//     });
//   };
//   const onCloseChooseExamAlert = () => {
//     setShowAlertTest(false);
//   };

//   const RenderExam = () => {
//     return (
//       <>
//         {loading && <LoadingAnimation visible={loading} loop={true} />}

//         {showAlert && (
//           <ChooseExamAlert
//             isVisible={showAlert}
//             onClose={handleOnClose}
//             message={alertMessage}
//           />
//         )}

//         {showAlertTest && (
//           <ChooseExamAlertSuccess
//             isVisible={showAlertTest}
//             onInstructions={handleOnInstructions}
//             onSkipIntructions={handleOnSkipIntructions}
//             message={alertMessageTest}
//             onClose={onCloseChooseExamAlert}
//           />
//         )}
//         <ScrollView
//           style={styles.mainConatiner}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* <SecoundaryHeader pageName="Choose Exam" /> */}

//           {/* <Text style={styles.txt}>Please Select Question Paper to Start Exam</Text> */}

//           <View style={styles.stepsContainer}>
//             <Text style={styles.header}>Steps to Create Test</Text>
//             <Text style={styles.step}>
//               <Text style={styles.stepNumber}>1. </Text>
//               Select the Examination Type, such as which exam you want to take.
//             </Text>
//             <Text style={styles.step}>
//               <Text style={styles.stepNumber}>2. </Text>
//               Choose the Exam Type wisely, like Pre, Mains, or Saral Seva.
//             </Text>
//             <Text style={styles.step}>
//               <Text style={styles.stepNumber}>3. </Text>
//               Choose other dropdown values if applicable.
//             </Text>
//             <Text style={styles.step}>
//               <Text style={styles.stepNumber}>4. </Text>
//               Select the timer you want in the exam or decide if you want a
//               timer at all.
//             </Text>
//           </View>

//           {/* <ChooseExamDropdown
//         selectedExam={selectedExam}
//         setSelectedExam={setSelectedExam}
//         selectedSubExam={selectedSubExam}
//         setSelectedSubExam={setSelectedSubExam}
//         selectedYear={selectedYear}
//         setSelectedYear={setSelectedYear}
//       /> */}
//           <CreateTestPage
//             selectedExamCategory={selectedExamCategory}
//             selectedSubExamType={selectedSubExamType}
//             selectedExamYear={selectedExamYear}
//             setSelectedExamCategory={setSelectedExamCategory}
//             setSelectedSubExamType={setSelectedSubExamType}
//             setSelectedExamYear={setSelectedExamYear}
//             yearDropIsVisible={yearDropIsVisible}
//             setYearDropIsVisible={setYearDropIsVisible}
//             // distDropIsVisible={distDropIsVisible}
//             // setDistDropIsVisible={setDistDropIsVisible}
//             detailPageValue={detailPageValue}
//           />
//           <PrimaryButton
//             styles={styles.button}
//             buttonTitle={loading ? "Loading..." : "Submit"}
//             handleOnSubmit={onSubmitChooseExam}
//             disabled={loading}
//           />
//           {/* {loading && <ActivityIndicator size="large" color={Color.primaryColor} />} */}

//           {/* <CustomAlert
//         showSingleButton
//         visible={showAlert}
//         onYes={() => setShowAlert(false)}
//         alertText="Question Paper is not available"
//       /> */}
//         </ScrollView>
//       </>
//     );
//   };

//   const RenderSubject = () => {
//     return (
//       <>
//         <Text>Subject</Text>
//       </>
//     );
//   };

//   const RenderTopic = () => {
//     return (
//       <>
//         <Text>Topic</Text>
//       </>
//     );
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <SecoundaryHeader pageName="Choose Exam" />

//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: Color.primaryColor, // Active tab text color
//           tabBarLabelStyle: {
//             fontSize: 16,
//             fontWeight: "bold",
//           }, // Style for tab labels
//           tabBarIndicatorStyle: {
//             backgroundColor: Color.primaryColor, // Color of the indicator
//             height: 2, // Height of the indicator
//           }, // Style for active tab indicator
//         }}
//       >
//         <Tab.Screen name="Exam" component={RenderExam} />
//         <Tab.Screen name="Subject" component={RenderSubject} />
//         <Tab.Screen name="Topic" component={RenderTopic} />
//       </Tab.Navigator>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainConatiner: {
//     // width: "100%",
//     // height: "100%",
//     backgroundColor: Color.colorWhite,
//     // flexGrow: 1,
//   },

//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     // marginBottom: 10,
//     paddingVertical: 10,
//     color: "blue", // Color of the header
//   },
//   step: {
//     marginBottom: 8,
//     color: "green", // Color of the step text
//   },
//   stepNumber: {
//     fontWeight: "bold",
//     color: "red", // Color of the step number
//   },
//   stepsContainer: {
//     paddingHorizontal: 20,
//     backgroundColor: Color.secoundaryBtnColor,
//     borderRadius: 20,
//     top: "8%",
//     marginHorizontal: 5,
//     paddingVertical: 10,
//   },

//   txt: {
//     textAlign: "center",
//     marginTop: "20%",
//     fontSize: 20,
//     justifyContent: "center",
//     color: Color.red,
//     width: "90%",
//     alignSelf: "center",
//   },
//   button: {
//     // marginTop: "5%",
//     marginTop: 20,
//   },
// });

// export default ChooseExam;

// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Border, Color, Padding } from "../GlobalStyles";
// import ChooseExamDropdown from "../Components/Dropdown/ChooseExamDropdown";
// import PrimaryButton from "../Components/Forms/PrimaryButton";
// import { useNavigation } from "@react-navigation/native";
// import { getTest } from "../Api/getTestApi";
// import * as ScreenOrientation from "expo-screen-orientation";
// import axios from "axios";
// import SecoundaryHeader from "../Components/Menus/SecoundaryHeader";

// const ChooseExam = ({}) => {
//   const navigation = useNavigation();

//   const [selectedExam, setSelectedExam] = useState("");
//   const [selectedSubExam, setSelectedSubExam] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [questionData, setQuestionData] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onSubmitChooseExam = async () => {
//     if (!selectedExam || !selectedSubExam || !selectedYear) {
//       alert("Please select all options");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.get("/get-question-paper", {
//         params: {
//           QPYearID: selectedYear,
//           catID: selectedExam,
//           subCatID: selectedSubExam,
//         },
//       });
//       const data = response.data.data;
//       setQuestionData(data);
//       navigation.navigate("TestPage", { questionData: data });
//     } catch (error) {
//       console.error("Error fetching question paper:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView>
//       <SecoundaryHeader pageName="Choose Exam" />

//       <Text style={styles.txt}>Please Select Question Paper to Start Exam</Text>
//       <ChooseExamDropdown
//         selectedExam={selectedExam}
//         setSelectedExam={setSelectedExam}
//         selectedSubExam={selectedSubExam}
//         setSelectedSubExam={setSelectedSubExam}
//         selectedYear={selectedYear}
//         setSelectedYear={setSelectedYear}
//       ></ChooseExamDropdown>
//       <PrimaryButton
//         styles={styles.button}
//         buttonTitle={loading ? "Loading..." : "Submit"}
//         handleOnSubmit={onSubmitChooseExam}
//         disabled={loading}
//       ></PrimaryButton>
//       {loading && <ActivityIndicator size="large" color={Color.primaryColor} />}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   txt: {
//     textAlign: "center",
//     marginTop: "20%",
//     fontSize: 20,
//     justifyContent: "center",
//     color: Color.red,
//     width: "90%",
//     alignSelf: "center",
//   },
//   button: {
//     marginTop: "5%",
//   },
// });

// export default ChooseExam;

// ChooseExam.js

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import CustomAlert from "../Components/Alert/CustomAlertPort";
import ChooseExamDropdown from "../Components/Dropdown/ChooseExamDropdown";
import PrimaryButton from "../Components/Forms/PrimaryButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SecoundaryHeader from "../Components/Menus/SecoundaryHeader";
import { Color } from "../GlobalStyles";
import CreateTestPage from "./CreateTestPage";
import LoadingAnimation from "../Components/Loader/loader";
import ChooseExamAlert from "../Components/Alert/ChooseExamAlert";
import ChooseExamAlertSuccess from "../Components/Alert/ChooseExamAlertSuccess";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChooseExam = ({}) => {
  const navigation = useNavigation();

  // const route = useRoute(); // Get the route object
  // const { detailPageValue } = route.params; // Destructure _id from params
  // const [selectedExamCategory, setSelectedExamCategory] = useState(
  //   detailPageValue._id
  // ); // Set default value

  const route = useRoute(); // Get the route object
  const { detailPageValue } = route.params || {}; // Destructure _id from params or use an empty object if params is undefined
  const [selectedExamCategory, setSelectedExamCategory] = useState(
    detailPageValue && detailPageValue._id ? detailPageValue._id : null // Check if detailPageValue and detailPageValue._id exist before accessing _id
  );

  useEffect(() => {
    if (!detailPageValue || !detailPageValue._id) {
      setSelectedExamCategory(null); // Update selectedExamCategory to null if detailPageValue or detailPageValue._id is not found
    }
  }, [detailPageValue]);

  // const [selectedExam, setSelectedExam] = useState("");
  // const [selectedSubExam, setSelectedSubExam] = useState("");
  // const [selectedYear, setSelectedYear] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [testId, setTestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showAlertTest, setShowAlertTest] = useState(false);
  const [alertMessageTest, setAlertMessageTest] = useState("");

  // const [selectedExamCategory, setSelectedExamCategory] = useState("");

  const [selectedSubExamType, setSelectedSubExamType] = useState("");
  const [selectedExamYear, setSelectedExamYear] = useState("");
  const [yearDropIsVisible, setYearDropIsVisible] = useState(true);
  const [distDropIsVisible, setDistDropIsVisible] = useState(true);
  const [selectedTimer, setSelectedTimer] = useState("1");

  const onSubmitChooseExam = async () => {
    // if (!selectedExam || !selectedSubExam || !selectedYear) {
    //   alert("Please select all options");
    //   return;
    // // }
    // console.log("selectedExamCategory" + selectedExamCategory);
    // console.log("selectedSubExamType" + selectedSubExamType);
    // console.log("selectedExamYear" + selectedExamYear);
    // console.log("selectedTimer" + selectedTimer);

    if (!selectedExamCategory) {
      alert("Please select an exam category");
      return;
    }

    if (!selectedSubExamType) {
      alert("Please select an exam type");
      return;
    }

    if (yearDropIsVisible && !selectedExamYear) {
      alert("Please select an exam year");
      return;
    }

    loadQuestionPaper();
  };

  const handleOnClose = () => {
    setShowAlert(false);
  };

  const loadQuestionPaper = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/question-papers/getQuestionPapersByFilter",
        {
          catID: selectedExamCategory,
          subCatID: selectedSubExamType,
          QPYearID: selectedExamYear,
        }
      );
      const incomingData = response.data.data;

      // console.log("-----------res------" + JSON.stringify(response.data));

      const myTestData = incomingData.map(
        ({ _id, question, option1, option2, option3, option4, answer }) => ({
          _id,
          question,
          option1,
          option2,
          option3,
          option4,
          answer,
        })
      );

      // console.log("===> My data ==>" + JSON.stringify(myTestData));

      const dataAuth = await AsyncStorage.getItem("@auth");
      const loginData = JSON.parse(dataAuth);
      const creatorId = loginData.user._id;
      const creatorName = loginData.user.name;

      // Send POST request with combinedQuestions
      const responseMainTest = await axios.post("/question-papers/main-test", {
        testName: selectedExamCategory,
        totalQuestions: myTestData.length,
        passingMarks: 0, // You can set this as required
        creatorId: creatorId,
        questions: myTestData,
      });

      // console.log(
      //   "=======QuestionPaper Data====== " +
      //     JSON.stringify(responseMainTest.data.data)
      // );
      // console.log(
      //   "=======QuestionPaper Data====== " + responseMainTest.data.data
      // );

      setQuestionData(responseMainTest.data.data.questions);
      setTestId(responseMainTest.data.data.testId);
      // console.log("QuestionPaper Data " + JSON.stringify(data));
      setShowAlertTest(true);
      setAlertMessageTest("Quick Tips: There are no Tips. Best of luck!");
      //===============when we are changing this message please do the changes in papercardcontainer in components question paper section ===
    } catch (error) {
      console.error("Error fetching question paper:", error);
      setShowAlert(true);
      setAlertMessage(
        "No question papers are available for the selected options. Please review your selections and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnInstructions = () => {
    navigation.navigate("InstructionPage", {
      questionData,
      testId,
      selectedExamCategory,
      selectedSubExamType,
      selectedExamYear,
      selectedTimer,
    });
  };

  const handleOnSkipIntructions = () => {
    navigation.navigate("TestPage", {
      questionData,
      testId,
      selectedExamCategory,
      selectedSubExamType,
      selectedExamYear,
      selectedTimer,
    });
  };
  const onCloseChooseExamAlert = () => {
    setShowAlertTest(false);
  };

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      {showAlert && (
        <ChooseExamAlert
          isVisible={showAlert}
          onClose={handleOnClose}
          message={alertMessage}
        />
      )}

      {showAlertTest && (
        <ChooseExamAlertSuccess
          isVisible={showAlertTest}
          onInstructions={handleOnInstructions}
          onSkipIntructions={handleOnSkipIntructions}
          message={alertMessageTest}
          onClose={onCloseChooseExamAlert}
        />
      )}
      <ScrollView
        style={styles.mainConatiner}
        showsVerticalScrollIndicator={false}
      >
        {/* <SecoundaryHeader pageName="Choose Exam" /> */}

        {/* <Text style={styles.txt}>Please Select Question Paper to Start Exam</Text> */}

        {/* <View style={styles.stepsContainer}>
          <Text style={styles.header}>Steps to Solve Test</Text>
          <Text style={styles.step}>
            <Text style={styles.stepNumber}>1. </Text>
            Select the Examination Type, such as which exam you want to take.
          </Text>
          <Text style={styles.step}>
            <Text style={styles.stepNumber}>2. </Text>
            Choose the Exam Type wisely, like Pre, Mains, or Saral Seva.
          </Text>
          <Text style={styles.step}>
            <Text style={styles.stepNumber}>3. </Text>
            Choose other dropdown values if applicable.
          </Text>
          <Text style={styles.step}>
            <Text style={styles.stepNumber}>4. </Text>
            Select the timer you want in the exam or decide if you want a timer
            at all.
          </Text>
        </View> */}

        {/* <ChooseExamDropdown
        selectedExam={selectedExam}
        setSelectedExam={setSelectedExam}
        selectedSubExam={selectedSubExam}
        setSelectedSubExam={setSelectedSubExam}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      /> */}
        <CreateTestPage
          selectedExamCategory={selectedExamCategory}
          selectedSubExamType={selectedSubExamType}
          selectedExamYear={selectedExamYear}
          setSelectedExamCategory={setSelectedExamCategory}
          setSelectedSubExamType={setSelectedSubExamType}
          setSelectedExamYear={setSelectedExamYear}
          yearDropIsVisible={yearDropIsVisible}
          setYearDropIsVisible={setYearDropIsVisible}
          // distDropIsVisible={distDropIsVisible}
          // setDistDropIsVisible={setDistDropIsVisible}
          detailPageValue={detailPageValue}
          selectedTimer={selectedTimer}
          setSelectedTimer={setSelectedTimer}
        />
        <PrimaryButton
          styles={styles.button}
          buttonTitle={loading ? "Loading..." : "Submit"}
          handleOnSubmit={onSubmitChooseExam}
          disabled={loading}
        />
        {/* {loading && <ActivityIndicator size="large" color={Color.primaryColor} />} */}

        {/* <CustomAlert
        showSingleButton
        visible={showAlert}
        onYes={() => setShowAlert(false)}
        alertText="Question Paper is not available"
      /> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainConatiner: {
    // width: "100%",
    // height: "100%",
    backgroundColor: Color.colorWhite,
    // flexGrow: 1,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 10,
    // paddingVertical: 10,
    color: "blue", // Color of the header
  },
  step: {
    marginBottom: 8,
    color: "green", // Color of the step text
  },
  stepNumber: {
    fontWeight: "bold",
    color: "red", // Color of the step number
  },
  stepsContainer: {
    paddingHorizontal: 20,
    backgroundColor: Color.secoundaryBtnColor,
    borderRadius: 20,
    top: "8%",
    marginHorizontal: 5,
    paddingVertical: 10,
  },

  txt: {
    textAlign: "center",
    marginTop: "20%",
    fontSize: 20,
    justifyContent: "center",
    color: Color.red,
    width: "90%",
    alignSelf: "center",
  },
  button: {
    // marginTop: "5%",
    marginTop: 20,
  },
});

export default ChooseExam;
