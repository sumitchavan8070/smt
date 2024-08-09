import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Keyboard,
  Alert,
} from "react-native";
import { Color } from "../GlobalStyles";
import InputBox from "../Components/Forms/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import LargeInput from "../Components/Forms/LargeInput";
import CreateTestPage from "./CreateTestPage";
import { useNavigation, useRoute } from "@react-navigation/native";
import PrimaryButton from "../Components/Forms/PrimaryButton";
import axios from "axios";
import CustomTestAlert from "../Components/Alert/CustomTestAlert";
import LoadingAnimation from "../Components/Loader/loader";

import loadingAnimation from "../assets/share.json";
import LottieView from "lottie-react-native";
import DraggableFlatList, {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CustomTestPage = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionPaperData, setQuestionPaperData] = useState([]);
  const [addButtonTitle, setAddButtonTitle] = useState("");
  const [questionPaperName, setQuestionPaperName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [activeTab, setActiveTab] = useState("Preview"); // State to track active tab
  const [subActiveTab, setSubActiveTab] = useState("exam"); // State to track active tab
  const [questionText, setQuestionText] = useState(""); // State for question input
  // const [options, setOptions] = useState(["", "", "", ""]); // State for options input
  const [options, setOptions] = useState(Array(4).fill(""));
  const [selectedOption, setSelectedOption] = useState(null); // State to track the selected option
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(""); // State for correct answer

  const route = useRoute(); // Get the route object
  const { detailPageValue } = route.params || {}; // Destructure _id from params or use an empty object if params is undefined
  const [selectedExamCategory, setSelectedExamCategory] = useState(
    detailPageValue && detailPageValue._id ? detailPageValue._id : null // Check if detailPageValue and detailPageValue._id exist before accessing _id
  );

  const [selectedSubExamType, setSelectedSubExamType] = useState("");
  const [selectedExamYear, setSelectedExamYear] = useState("");
  const [yearDropIsVisible, setYearDropIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState("");
  const [testId, setTestId] = useState("");
  const navigation = useNavigation();

  // const handleShareTest = () => {
  //   if (selectedQuestions.length < 1 || selectedQuestions.length > 100) {
  //     alert("Please select between 10 and 100 questions.");
  //     return;
  //   }
  //   if (!questionPaperName) {
  //     alert("Please enter question paper name");
  //     return;
  //   }
  //   const myQuestion = selectedQuestions.map((question) => ({
  //     _id: question._id,
  //     question: question.question,
  //     option1: question.option1,
  //     option2: question.option2,
  //     option3: question.option3,
  //     option4: question.option4,
  //     answer: question.answer,
  //   }));

  //   const myTest = JSON.stringify(myTestData);
  //   console.log(myTest);

  //   // const prefix = "MA";
  //   // const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generates 6 random digits
  //   // const TestId = prefix + randomDigits;
  //   // console.log("------ :" + TestId);
  // };

  // const handleShareTest = async () => {
  //   if (selectedQuestions.length < 1 || selectedQuestions.length > 100) {
  //     alert("Please select between 10 and 100 questions.");
  //     return;
  //   }
  //   if (!questionPaperName) {
  //     alert("Please enter question paper name");
  //     return;
  //   }

  //   const myTestData = selectedQuestions.map((question) => ({
  //     _id: question._id,
  //     question: question.question,
  //     option1: question.option1,
  //     option2: question.option2,
  //     option3: question.option3,
  //     option4: question.option4,
  //     answer: question.answer,
  //   }));

  //   const myQuestion = selectedQuestions.map((question) => ({
  //     _id: question._id,
  //     question: question.question,
  //     option1: question.option1,
  //     option2: question.option2,
  //     option3: question.option3,
  //     option4: question.option4,
  //     answer: question.answer,
  //   }));

  //   try {
  //     const data = await AsyncStorage.getItem("@auth");
  //     let loginData = JSON.parse(data);
  //     let creatorId = loginData.user._id;

  //     const response = await axios.post("/customtest/custom-test", {
  //       testName: questionPaperName,
  //       totalQuestions: myTestData.length,
  //       passingMarks: 0, // You can set this as required
  //       creatorId: creatorId, // Assuming you have the user ID available
  //       questions: myTestData,
  //     });

  //     if (response.data.success) {
  //       // alert("Test uploaded successfully!");
  //       // Optionally, you can redirect or perform any other action here
  //       setShowAlert(true);
  //       setAlertMessage(
  //         "Congratulations! Your test is all set and ready to share with a single click!"
  //       );
  //       // console.log("------" + JSON.stringify(response.data.data));
  //       // setTestId(response.data);
  //       setTestId(response.data.data);
  //     } else {
  //       alert("Failed to upload test. Please try again later.");
  //     }
  //   } catch (error) {
  //     alert(error.response.message);
  //     console.error(error);
  //   }
  // };

  const handleShareTest = async () => {
    if (selectedQuestions.length < 1 || selectedQuestions.length > 100) {
      Alert.alert("Please add questions between 10 to 100.");
      return;
    }
    if (!questionPaperName) {
      Alert.alert("Please enter question paper name");
      return;
    }

    // Prepare myTestData
    // const myTestData = selectedQuestions.map((question) => ({
    //   _id: question._id,
    //   question: question.question,
    //   option1: question.option1,
    //   option2: question.option2,
    //   option3: question.option3,
    //   option4: question.option4,
    //   answer: question.answer,
    // }));

    const myTestData = selectedQuestions.map((question) => {
      const {
        _id,
        question: questionText,
        option1,
        option2,
        option3,
        option4,
        answer,
        options,
      } = question;
      const formattedOptions =
        options && options.length === 4
          ? options
          : [option1, option2, option3, option4];

      return {
        _id,
        question: questionText,
        option1: formattedOptions[0],
        option2: formattedOptions[1],
        option3: formattedOptions[2],
        option4: formattedOptions[3],
        answer,
      };
    });

    // console.log("=========>" + JSON.stringify(myTestData));

    try {
      setLoading(true);

      // Fetch user data from AsyncStorage
      const data = await AsyncStorage.getItem("@auth");
      const loginData = JSON.parse(data);
      const creatorId = loginData.user._id;
      const creatorName = loginData.user.name;

      // Send POST request with combinedQuestions
      const response = await axios.post("/customtest/custom-test", {
        testName: questionPaperName,
        totalQuestions: myTestData.length,
        passingMarks: 0, // You can set this as required
        creatorId: creatorId,
        questions: myTestData,
      });

      setLoading(false);
      const currentTime = new Date().getTime(); // Get current time as a string

      if (response.data.success) {
        setShowAlert(true);
        setAlertMessage(creatorName);
        // `Congratulations! ${creatorName}` +
        // "\n" +
        // `Your test is all set and ready to share with a single click!`
        setTestId(response.data.data.testId);

        // await AsyncStorage.setItem(
        //   `@createdTest_${currentTime}`,
        //   JSON.stringify(response)
        // );
        const testEntry = {
          response,
          timestamp: currentTime, // Add timestamp to the test entry
        };

        try {
          await AsyncStorage.setItem(
            `createdTest_${currentTime}`,
            JSON.stringify(testEntry)
          );
          // console.log("Test entry saved successfully:", testEntry);
        } catch (error) {
          console.error("Error saving test entry:", error);
        }
      } else {
        Alert.alert("Failed to upload test. Please try again later.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error uploading test. Please try again later.");
      console.error(error);
    }
  };

  const handleOnClose = () => {
    setShowAlert(false);
    setAlertMessage("");
    navigation.navigate("History");
  };

  const handleRemoveQuestion = (questionId) => {
    // console.log("----------" + JSON.stringify(selectedQuestions));
    // console.log("-----id-----" + JSON.stringify(questionId));

    const updatedQuestions = selectedQuestions.filter(
      (question) => question._id !== questionId
    );
    setSelectedQuestions(updatedQuestions);
  };

  const handleAddQuestion = (questionId) => {
    // console.log("---------" + questionId);
    // Find the selected question by its ID

    const selectedQuestion = questionPaperData.find(
      (question) => question._id === questionId
    );

    // Check if the selected question is already in the selectedQuestions list
    const isAlreadySelected = selectedQuestions.some(
      (question) => question._id === selectedQuestion._id
    );

    // If the question is not already selected, add it to the list
    if (!isAlreadySelected) {
      // Add options array to the selected question
      const formattedQuestion = {
        ...selectedQuestion,
        options: [
          selectedQuestion.option1,
          selectedQuestion.option2,
          selectedQuestion.option3,
          selectedQuestion.option4,
        ],
      };

      // setSelectedQuestions((prevQuestions) => [
      //   ...prevQuestions,
      //   formattedQuestion,
      // ]);

      if (selectedQuestions.length < 100) {
        setSelectedQuestions((prevQuestions) => [
          ...prevQuestions,
          formattedQuestion,
        ]);

        // alert(
        //   "Question successfully added. You can view the test in the preview section."
        // );
      } else {
        alert("You have reached the maximum limit of 100 questions.");
      }
    } else {
      alert(
        "Apologies, but it appears that this question has already been added to the list."
      );
    }
  };

  useEffect(() => {
    knowCurrentUser();
    if (!detailPageValue || !detailPageValue._id) {
      setSelectedExamCategory(null); // Update selectedExamCategory to null if detailPageValue or detailPageValue._id is not found
    }
  }, [detailPageValue]);

  const knowCurrentUser = async () => {
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let username = loginData.user.username;
    setPreparedBy(username);
  };
  const handleOptionSelect = (index) => {
    if (selectedOption !== options[index]) {
      setSelectedOption(options[index]);
    } else {
      setSelectedOption(null); // Deselect the option if it's already selected
    }
  };

  const handleAddQuestionOwnQuestion = () => {
    Keyboard.dismiss();

    if (selectedQuestions.length > 100) {
      alert("Please select between 10 and 100 questions.");
      return;
    }

    if (!questionText.trim()) {
      alert("Please enter the question.");
      return;
    }

    if (!options.every((option) => option.trim())) {
      alert("Please fill all options.");
      return;
    }

    if (!selectedOption) {
      alert("Please select the correct answer.");
      return;
    }
    const uniqueNumber = Math.floor(Math.random() * 1000); // Generate a random unique number

    // console.log("=======Options in Question " + JSON.stringify(options));
    // const optionsArray = options.map((option, index) => ({
    //   [`Option${index + 1}`]: option,
    // }));

    // console.log("===>" + JSON.stringify(optionsArray));
    const newQuestion = {
      _id: selectedQuestions.length + 1 + uniqueNumber, // Generate a unique ID for the new question
      question: questionText,
      options: options,
      answer: selectedOption,
    };

    // console.log(
    //   "=========2" + JSON.stringify([...selectedQuestions, newQuestion])
    // );

    if (selectedQuestions.length < 100) {
      setSelectedQuestions([...selectedQuestions, newQuestion]);
    } else {
      alert("You have reached the maximum limit of 100 questions.");
    }
    setActiveTab("Preview");
    // Clear input fields after adding the question
    setQuestionText("");
    // setOptions(Array(4).fill(""));
    // setSelectedOption(null);
  };

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleSearch = async () => {};

  const onSubmitGetQuestionsExamSection = async () => {
    // console.log("selectedExamCategory" + selectedExamCategory);
    // console.log("selectedSubExamType" + selectedSubExamType);
    // console.log("selectedExamYear" + selectedExamYear);

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
      const data = response.data.data;
      setQuestionPaperData(data);
      setAddButtonTitle("Add Question");
      // console.log("QuestionPaper Data " + JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching question paper:", error);
      alert(
        "No question papers are available for the selected options. Please review your selections and try again."
      );
    } finally {
      setLoading(false);
      setSubActiveTab("list");
    }
  };

  // const renderCardNumber = ({ item, index, drag }) => (
  //   <View key={item._id} style={styles.questionContainer}>
  //     <View style={styles.iconConatiner}>
  //       <TouchableOpacity
  //         onPress={() => handleRemoveQuestion(item._id)}
  //         style={styles.removeButtonButton}
  //       >
  //         <MaterialIcons
  //           name="delete"
  //           size={20}
  //           style={[styles.icon, styles.removeButton]}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity onLongPress={drag}>
  //         <MaterialIcons
  //           name="drag-indicator"
  //           size={20}
  //           style={[styles.icon, styles.dragIcon]}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //     <View style={styles.question}>
  //       <Text style={styles.questionNumber}>
  //         {index + 1}
  //         {")"}
  //       </Text>
  //       <Text style={styles.questionText}>{item.question}</Text>
  //     </View>
  //     <View style={styles.optionsContainer}>
  //       {item.options.map((option, optionIndex) => (
  //         <Text key={optionIndex} style={styles.optionText}>
  //           {`Option ${optionIndex + 1}: ${option}`}
  //         </Text>
  //       ))}
  //     </View>
  //     <Text style={styles.answerText}>{`Correct Answer: ${item.answer}`}</Text>
  //     <View style={styles.borderLine} />
  //   </View>
  // );

  let questionNo = 0;
  const renderDraggableQuestion = ({ item, drag, index, isActive }) => {
    questionNo++;
    return (
      <View key={item._id} style={styles.questionContainer}>
        <View style={styles.iconConatiner}>
          <TouchableOpacity
            onPress={() => handleRemoveQuestion(item._id)}
            style={styles.removeButtonButton}
          >
            <MaterialIcons
              name="delete"
              size={20}
              style={[styles.icon, styles.removeButton]}
            />
          </TouchableOpacity>
          <TouchableOpacity onLongPress={drag}>
            <MaterialIcons
              name="drag-indicator"
              size={20}
              style={[styles.icon, styles.dragIcon]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.question}>
          <Text style={styles.questionNumber}>
            {questionNo} {/* Display custom card number */}
            {")"}
          </Text>
          <Text style={styles.questionText}>{item.question}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {item.options.map((option, optionIndex) => (
            <Text key={optionIndex} style={styles.optionText}>
              {`Option ${optionIndex + 1}: ${option}`}
            </Text>
          ))}
        </View>
        <Text style={styles.answerText}>
          {`Correct Answer: ${item.answer}`}
        </Text>
        <View style={styles.borderLine} />
      </View>
    );
  };

  const selectedQuestionCount = questionPaperData.filter((question) =>
    selectedQuestions.some((q) => q._id === question._id)
  ).length;

  return (
    <View style={styles.container}>
      {/* =========================================================================== Question Preview Model ============================================ */}

      {showAlert && (
        <CustomTestAlert
          isVisible={showAlert}
          onClose={handleOnClose}
          message={alertMessage}
          testId={testId}
        />
      )}
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <Modal
        visible={showPreviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={togglePreviewModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.boxHeading}>Test Preview</Text>

            {/* Your test preview content goes here */}
            {/* You can reuse the existing test preview code here */}

            {/* <ScrollView style={styles.questionBox}> */}
            {/* prepared By */}
            <Text style={styles.questionPaperHeading}>
              Total Questions :
              <Text style={styles.questionPaperHeadingText}>
                {selectedQuestions.length}
              </Text>
            </Text>
            <Text style={styles.questionPaperHeading}>
              Prepared By :
              <Text style={styles.questionPaperHeadingText}>{preparedBy}</Text>
            </Text>
            {/* Test Name */}
            <Text style={styles.questionPaperHeading}>
              Test Name :
              <Text style={styles.questionPaperHeadingText}>
                {questionPaperName}
              </Text>
            </Text>
            <View style={styles.borderLine} />
            {selectedQuestions.map((question, index) => (
              <View key={question.id} style={styles.questionContainer}>
                {/* <TouchableOpacity
                  onPress={() => handleRemoveQuestion(question.id)}
                  style={styles.removeButtonButton}
                >
                  <Text style={styles.removeButton}>Remove Question</Text>
                </TouchableOpacity> */}
                <View style={styles.question}>
                  <Text style={styles.questionNumber}>{index + 1}</Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                </View>
                <View style={styles.optionsContainer}>
                  {question.options.map((option, optionIndex) => (
                    <Text key={optionIndex} style={styles.optionText}>
                      {`Option${optionIndex + 1}: ${option}`}
                    </Text>
                  ))}
                </View>
                <Text style={styles.answerText}>
                  {`Correct Answer: ${question.answer}`}
                </Text>

                <View style={styles.borderLine} />
              </View>
            ))}
            {/* </ScrollView> */}
          </ScrollView>
          <TouchableOpacity
            onPress={togglePreviewModal}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close Preview</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* =========================================================================== Question Preview Model ============================================ */}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Preview" && styles.activeTab]}
          onPress={() => setActiveTab("Preview")}
        >
          <Text
            //  style={styles.tabText}
            style={[
              styles.tabText,
              activeTab === "Preview" && styles.selectedTabText,
            ]}
          >
            Preview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "create" && styles.activeTab]}
          onPress={() => {
            setActiveTab("create");
            setQuestionText("");
            setOptions(Array(4).fill(""));
            setSelectedOption(null);
          }}
        >
          <Text
            // style={styles.tabText}
            style={[
              styles.tabText,
              activeTab === "create" && styles.selectedTabText,
            ]}
          >
            Create Own Quetion
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "get" && styles.activeTab]}
          onPress={() => setActiveTab("get")}
        >
          <Text
            //  style={styles.tabText}
            style={[
              styles.tabText,
              activeTab === "get" && styles.selectedTabText,
            ]}
          >
            Get Our
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {/* {activeTab === "Preview" && (
          <ScrollView>
            <View style={styles.previewBtnContainer}>

              <TouchableOpacity
                style={styles.buttonPreview}
                onPress={togglePreviewModal}
              >
                <Fontisto
                  name="preview"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Preview Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonShare}
                onPress={handleShareTest}
              >
                <Entypo
                  name="paper-plane"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Share Test</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.questionBox}>
              <Text style={styles.questionLabel}>
                Total Questions :
                <Text style={styles.questionPaperHeadingText}>
                  {selectedQuestions.length}
                </Text>
              </Text>
              <Text style={styles.questionLabel}>
                Prepared By :
                <Text style={styles.questionPaperHeadingText}>
                  {preparedBy}
                </Text>
              </Text>

              <View style={styles.questionPaperHeading}>
                <Text style={styles.questionLabel}>Test Name :</Text>
                <TextInput
                  style={styles.questionPaperHeadingText}
                  value={questionPaperName}
                  onChangeText={setQuestionPaperName}
                  placeholder="Enter test name"
                />
              </View>

              <View style={styles.borderLine} />

              {selectedQuestions.length === 0 ? (
                <>
                  <Text style={styles.noQuestionsText}>
                    Please Add Questions
                  </Text>

                  <LottieView
                    source={loadingAnimation} // Replace with your animation JSON file
                    autoPlay
                    loop={true}
                    style={styles.animation}
                  />
                </>
              ) : (
                selectedQuestions.map((question, index) => (
                  <View key={question._id} style={styles.questionContainer}>
                    <TouchableOpacity
                      onPress={() => handleRemoveQuestion(question._id)}
                      style={styles.removeButtonButton}
                    >
                      <Text style={styles.removeButton}>Remove Question</Text>
                    </TouchableOpacity>
                    <View style={styles.question}>
                      <Text style={styles.questionNumber}>
                        {index + 1}
                        {")"}
                      </Text>
                      <Text style={styles.questionText}>
                        {question.question}
                      </Text>
                    </View>
                    <View style={styles.optionsContainer}>
                      {question.options.map((option, optionIndex) => (
                        <Text key={optionIndex} style={styles.optionText}>
                          {`Option ${optionIndex + 1}: ${option}`}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.answerText}>
                      {`Correct Answer: ${question.answer}`}
                    </Text>

                    <View style={styles.borderLine} />
                  </View>
                ))
              )}

            </ScrollView>
          </ScrollView>
        )} */}

        {activeTab === "Preview" && (
          <GestureHandlerRootView>
            <NestableScrollContainer showsVerticalScrollIndicator={false}>
              <View style={styles.previewBtnContainer}>
                <TouchableOpacity
                  style={styles.buttonPreview}
                  onPress={() => {
                    if (selectedQuestions.length === 0) {
                      Alert.alert("Please add questions as per instructions");
                      return;
                    }
                    togglePreviewModal();
                  }}
                >
                  <Fontisto
                    name="preview"
                    size={20}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Preview Test</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonShare}
                  onPress={handleShareTest}
                >
                  <Ionicons
                    name="cloud-done"
                    size={20}
                    color="#fff"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Create Test</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.questionBox}>
                <Text style={styles.questionLabel}>
                  Total Questions :
                  <Text style={styles.questionPaperHeadingText}>
                    {selectedQuestions.length}
                  </Text>
                </Text>
                <Text style={styles.questionLabel}>
                  Prepared By :
                  <Text style={styles.questionPaperHeadingText}>
                    {preparedBy}
                  </Text>
                </Text>
                <View style={styles.questionPaperHeading}>
                  <Text style={styles.questionLabel}>Test Name :</Text>
                  <TextInput
                    style={styles.questionPaperHeadingText}
                    value={questionPaperName}
                    onChangeText={setQuestionPaperName}
                    placeholder="Enter test name"
                  />
                </View>
                <View style={styles.borderLine} />

                {selectedQuestions.length === 0 ? (
                  <>
                    {/* <Text style={styles.noQuestionsText}>
                      Please Follow Instructions
                    </Text> */}
                    <LottieView
                      source={loadingAnimation}
                      autoPlay
                      loop={true}
                      style={styles.animation}
                    />
                    <View
                      style={{
                        backgroundColor: Color.lighYellow,
                        justifyContent: "center",
                        // alignItems: "center",
                        gap: 10,
                        padding: 20,
                        marginBottom: 50,
                      }}
                    >
                      import {MaterialCommunityIcons} from '@expo/vector-icons';
                      <View style={styles.count}>
                        <MaterialCommunityIcons
                          name="lightbulb-on"
                          style={styles.bulb}
                        />
                        <Text>How to Add Questions:</Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text>1. You can create and add </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setActiveTab("create");
                          }}
                        >
                          <Text style={{ color: Color.primaryColor }}>
                            Own Questions
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text>2. You can choose from </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setActiveTab("get");
                          }}
                        >
                          <Text style={{ color: Color.primaryColor }}>
                            Our Collection.
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text>3. You can combine your questions with ours.</Text>
                      <View
                        style={{
                          padding: 20,
                          justifyContent: "center",
                          alignSelf: "center",
                          gap: 20,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.insBtn}
                          onPress={() => {
                            setActiveTab("get");
                          }}
                        >
                          <Text style={{ color: Color.colorWhite }}>
                            Get Our Questions
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.insBtn}
                          onPress={() => {
                            setActiveTab("create");
                          }}
                        >
                          <Text style={{ color: Color.colorWhite }}>
                            Create Own Question
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  <NestableDraggableFlatList
                    data={selectedQuestions}
                    renderItem={renderDraggableQuestion}
                    keyExtractor={(item) => item._id.toString()}
                    // onDragEnd={({ data }) => setSelectedQuestions(data)}
                    onDragEnd={({ data }) => {
                      setSelectedQuestions(data);
                      // Update questionNo based on the new order after dragging
                      questionNo =
                        data.findIndex(
                          (item) =>
                            item._id === selectedQuestions[questionNo - 1]
                        ) + 1;
                    }}
                  />
                )}
              </View>
            </NestableScrollContainer>
          </GestureHandlerRootView>
        )}

        {activeTab === "create" && (
          <View>
            <LargeInput
              inputPlaceholderText="Enter your question here"
              inputLabel={"Question"}
              value={questionText}
              setValue={setQuestionText}
            />
            {options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <FontAwesome5
                  name={selectedOption === option ? "check-circle" : "circle"} // Show check mark for selected option
                  size={20}
                  color={selectedOption === option ? "#6949ff" : "#ccc"} // Change color for selected option
                  onPress={() => handleOptionSelect(index)} // Handle option selection
                  style={styles.checkIcon}
                />
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChangeText={(text) =>
                    setOptions((prevOptions) => {
                      const updatedOptions = [...prevOptions];
                      updatedOptions[index] = text;
                      return updatedOptions;
                    })
                  }
                />
              </View>
            ))}

            {selectedOption && (
              <Text style={styles.selectedAnswer}>
                Selected Answer: {selectedOption}
              </Text>
            )}

            {/* Add question button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddQuestionOwnQuestion}
            >
              <Text style={styles.addButtonText}>Add Question</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Placeholder for Get Our Question tab content */}
        {/* {activeTab === "get" && <Text>Get Our Question content here</Text>} */}

        {activeTab === "get" && (
          <View style={{}}>
            <Text style={styles.boxHeading}>Filter Questions</Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setSubActiveTab("list")}
                style={[
                  styles.tab,
                  subActiveTab === "list" && styles.activeTab,
                ]}
              >
                <Text>List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSubActiveTab("exam")}
                style={[
                  styles.tab,
                  subActiveTab === "exam" && styles.activeTab,
                ]}
              >
                <Text>Exam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSubActiveTab("subject")}
                style={[
                  styles.tab,
                  subActiveTab === "subject" && styles.activeTab,
                ]}
              >
                <Text>Subject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSubActiveTab("topic")}
                style={[
                  styles.tab,
                  subActiveTab === "topic" && styles.activeTab,
                ]}
              >
                <Text>Topic</Text>
              </TouchableOpacity>
            </View>

            {subActiveTab === "list" && (
              <ScrollView style={styles.questionBox}>
                <View style={styles.count}>
                  <MaterialCommunityIcons
                    name="lightbulb-on"
                    style={styles.bulb}
                  />
                  <Text>
                    Your <Text>{selectedQuestionCount}</Text> questions are
                    added to
                  </Text>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      setActiveTab("Preview");
                    }}
                  >
                    <Text style={styles.previewText}>Preview</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.clearBtnContainer}>
                  <TouchableOpacity
                    style={styles.buttonDone}
                    onPress={() => setQuestionPaperData([])}
                  >
                    <Ionicons
                      name="checkmark-done-circle"
                      style={styles.buttonDone}
                    />
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonClear}
                    onPress={() => setQuestionPaperData([])}
                  >
                    <MaterialCommunityIcons
                      name="broom"
                      style={styles.clearBtnIcon}
                    />
                    <Text style={styles.clearText}>Clear all</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.boxHeading}>Questions List</Text>
                <View style={styles.borderLine} />
                {/* 
                {questionPaperData.length === 0 ? (
                  <Text style={styles.noQuestionsText}>
                    Please Add Questions
                  </Text>
                ) : (
                  questionPaperData.map((question, index) => (
                    <View key={question._id} style={styles.questionContainer}>
                      <TouchableOpacity
                        onPress={() => handleAddQuestion(question._id)}
                        style={styles.addQuestionButtonButton}
                      >
                        <Text style={styles.addQuestionButton}>
                          {addButtonTitle}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.question}>
                        <Text style={styles.questionNumber}>{index + 1}</Text>
                        <Text style={styles.questionText}>
                          {question.question}
                        </Text>
                      </View>
                      <View style={styles.optionsContainer}>
                        <Text
                          style={styles.optionText}
                        >{`Option1: ${question.option1}`}</Text>
                        <Text
                          style={styles.optionText}
                        >{`Option2: ${question.option2}`}</Text>
                        <Text
                          style={styles.optionText}
                        >{`Option3: ${question.option3}`}</Text>
                        <Text
                          style={styles.optionText}
                        >{`Option4: ${question.option4}`}</Text>
                      </View>

                      <Text style={styles.answerText}>
                        {`Correct Answer: ${question.answer}`}
                      </Text>
                      <View style={styles.borderLine} />
                    </View>
                  ))
                )} */}

                {questionPaperData.length === 0 ? (
                  <>
                    <Text style={styles.noQuestionsText}>
                      Please Add Questions
                    </Text>

                    <LottieView
                      source={loadingAnimation} // Replace with your animation JSON file
                      autoPlay
                      loop={true}
                      style={styles.animation}
                    />
                  </>
                ) : (
                  questionPaperData.map((question, index) => {
                    // const addButtonTitle = selectedQuestions.some(
                    //   (q) => q._id === question._id
                    // )
                    //   ? "Added"
                    //   : "Add Question";

                    const addButtonTitle = selectedQuestions.some(
                      (q) => q._id === question._id
                    ) ? (
                      // <Text style={styles.addedQuestionButton}>
                      //   Added to Preview
                      // </Text>

                      <FontAwesome5
                        name={"check-circle"} // Show check mark for selected option
                        size={20}
                        color={Color.primaryColor} // Change color for selected option
                        style={styles.checkIcon}
                      />
                    ) : (
                      <Text style={styles.addQuestionButton}>Add Question</Text>
                    );

                    return (
                      <View key={question._id} style={styles.questionContainer}>
                        <TouchableOpacity
                          onPress={() => handleAddQuestion(question._id)}
                          style={styles.addQuestionButtonButton}
                        >
                          <Text style={styles.addQuestionButton}>
                            {addButtonTitle}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.question}>
                          <Text style={styles.questionNumber}>{index + 1}</Text>
                          <Text style={styles.questionText}>
                            {question.question}
                          </Text>
                        </View>
                        <View style={styles.optionsContainer}>
                          <Text
                            style={styles.optionText}
                          >{`Option1: ${question.option1}`}</Text>
                          <Text
                            style={styles.optionText}
                          >{`Option2: ${question.option2}`}</Text>
                          <Text
                            style={styles.optionText}
                          >{`Option3: ${question.option3}`}</Text>
                          <Text
                            style={styles.optionText}
                          >{`Option4: ${question.option4}`}</Text>
                        </View>

                        <Text style={styles.answerText}>
                          {`Correct Answer: ${question.answer}`}
                        </Text>
                        <View style={styles.borderLine} />
                      </View>
                    );
                  })
                )}
              </ScrollView>
            )}

            {subActiveTab === "exam" && (
              <ScrollView style={styles.createTestContainer}>
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
                />
                <PrimaryButton
                  styles={styles.button}
                  buttonTitle={loading ? "Loading..." : "Get Questions"}
                  handleOnSubmit={onSubmitGetQuestionsExamSection}
                  disabled={loading}
                />
              </ScrollView>
            )}

            {subActiveTab === "subject" && (
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>Search Subject</Text>
              </TouchableOpacity>
            )}

            {subActiveTab === "topic" && (
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>Search Topic</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clearBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doneText: {
    color: Color.colorWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
  doneBtnIcon: {
    fontSize: 24,
    color: Color.colorWhite,
  },
  buttonDone: {
    flexDirection: "row",
    backgroundColor: Color.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
  },
  clearText: {
    color: Color.colorWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
  clearBtnIcon: {
    fontSize: 24,
    color: Color.colorWhite,
  },
  buttonClear: {
    flexDirection: "row",
    backgroundColor: Color.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
  },
  insBtn: {
    backgroundColor: Color.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    backgroundColor: Color.lighYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 10,
    borderColor: Color.primaryColor,
    borderWidth: 0.5,
    borderRadius: 30,
  },
  bulb: {
    fontSize: 24,
    color: Color.yellow,
  },
  previewText: {
    color: Color.primaryColor,
    borderBottomWidth: 1,
    borderBottomColor: Color.primaryColor,
  },
  iconConatiner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 30,
    // right: 20,
    // paddingHorizontal: 20,
  },
  animation: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },

  createTestContainer: {
    backgroundColor: Color.secoundaryBtnColor,
  },
  searchButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  filterPanel: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    elevation: 3, // for shadow on Android
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noQuestionsText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  selectedTabText: {
    color: Color.primaryColor,
  },
  icon: {
    alignSelf: "center",
  },
  buttonPreview: {
    backgroundColor: Color.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignContent: "center",
  },
  buttonShare: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  previewBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectedAnswer: {
    fontWeight: "bold",
    color: Color.red,

    alignSelf: "center",
  },
  showPreviewButton: {
    backgroundColor: Color.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginVertical: 20,
  },
  showPreviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginVertical: 20,
  },

  addButtonText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Color.colorWhite,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    width: "90%",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 10,
  },
  optionInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    padding: 5,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Color.primaryColor,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tabContent: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  boxHeading: {
    color: Color.primaryColor,
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 10,
    alignSelf: "center",
  },
  questionLabel: {
    color: Color.primaryColor,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  questionPaperHeadingText: {
    color: Color.colorBlack,
    fontWeight: "bold",
  },
  questionPaperHeading: {
    flexDirection: "row",
    marginBottom: 10,
  },
  removeButtonButton: {
    alignSelf: "flex-end",
  },

  addQuestionButtonButton: {
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: 30,
    backgroundColor: Color.colorWhite,
  },
  questionBox: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: 5,
    padding: 10,
    // marginBottom: 10,
    width: "100%",
    // height: "30%",
    // maxHeight: 500,
    alignSelf: "center",
  },
  question: {
    flexDirection: "row",
    gap: 10,
  },

  questionNumber: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  questionText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    marginBottom: 5,
  },

  answerText: {
    fontWeight: "bold",
    marginVertical: 10,
  },

  questionViewBox: {
    borderWidth: 2,
    borderColor: Color.primaryColor,
    padding: 10,
    marginBottom: 20,
  },
  questionViewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Color.primaryColor,
  },
  questionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  removeButton: {
    color: "red",
    fontWeight: "bold",
  },

  dragIcon: {
    color: Color.primaryColor,
    fontWeight: "bold",
  },

  addQuestionButton: {
    color: Color.primaryColor,
    fontWeight: "bold",
  },

  addedQuestionButton: {
    color: Color.yellow,
    fontWeight: "bold",
  },

  correctAnswer: {
    fontWeight: "bold",
    marginTop: 5,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
});

export default CustomTestPage;
