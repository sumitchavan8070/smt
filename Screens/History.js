import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Modal,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HistoryCard from "../Components/Cards/HistoryCard";
import FooterMenu from "../Components/Menus/FooterMenu";
import HeaderMenu from "../Components/Menus/HeaderMenu";
import { Color } from "../GlobalStyles";
import CreatedTestComponent from "../Components/HistoryComp/CreatedTestComponent";
import LottieView from "lottie-react-native";
import loadingAnimation from "../assets/testhistory.json";
import GroupSelectionModal from "../Components/Group/GroupSelectionModal";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import Watermark from "../Components/BetaBanner/Watermark";

const History = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the route object
  const { tabScreen } = route.params || {}; // Destructure _id from params or use an empty object if params is undefined

  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createdTestData, setCreatedTestData] = useState([]);

  // useEffect(() => {
  //   const fetchAllTestData = async () => {
  //     try {
  //       const allKeys = await AsyncStorage.getAllKeys();
  //       // const filteredKeys = allKeys.filter((key) => key !== "@auth");
  //       const filteredKeys = allKeys.filter(
  //         (key) => key !== "@auth" && !key.includes("fcm")
  //       );

  //       const data = await AsyncStorage.multiGet(filteredKeys);

  //       const testDataArray = [];
  //       const createdTestDataArray = [];

  //       // console.log("======data==========" + data);

  //       data.forEach(([key, value]) => {
  //         // console.log("======data2==========" + data);
  //         // console.log("======data2key==========" + key);

  //         // console.log("=======>value " + value);
  //         const entry = JSON.parse(value);
  //         // const date = new Date(parseInt(entry.timestamp));
  //         // const formattedDate = `${date.getDate()}/${
  //         //   date.getMonth() + 1
  //         // }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

  //         // const dataObject = { ...entry, timestamp: formattedDate };

  //         // if (key === "@createdTest") {
  //         //   createdTestDataArray.push(dataObject);
  //         // } else {
  //         //   testDataArray.push(dataObject);
  //         // }

  //         if (key.includes("createdTest")) {
  //           createdTestDataArray.push(entry);
  //         } else {
  //           testDataArray.push(entry);
  //         }
  //       });

  //       setTestData(testDataArray);
  //       setCreatedTestData(createdTestDataArray);
  //       // console.log("----------" + JSON.stringify(testDataArray));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching test data:", error);
  //       setLoading(false);
  //       // Alert.alert("Error fetching test data. Please try again later.");
  //       setTestData([]);
  //     }
  //   };

  //   // fetchAllTestData();
  //   if (testData.length === 0 || createdTestData.length === 0) {
  //     fetchAllTestData();
  //   }
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (tabScreen) {
        setActiveTab(tabScreen);
      }

      const fetchAllTestData = async () => {
        try {
          const allKeys = await AsyncStorage.getAllKeys();
          // const filteredKeys = allKeys.filter((key) => key !== "@auth");
          const filteredKeys = allKeys.filter(
            (key) => key !== "@auth" && !key.includes("fcm")
          );

          const data = await AsyncStorage.multiGet(filteredKeys);

          const testDataArray = [];
          const createdTestDataArray = [];
          data.forEach(([key, value]) => {
            const entry = JSON.parse(value);
            if (key.includes("createdTest")) {
              createdTestDataArray.push(entry);
            } else {
              testDataArray.push(entry);
            }
          });

          createdTestDataArray.sort((a, b) => {
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;
            return timestampB - timestampA;
          });

          testDataArray.sort((a, b) => {
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;
            return timestampB - timestampA;
          });
          setTestData(testDataArray);
          setCreatedTestData(createdTestDataArray);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching test data:", error);
          setLoading(false);
          setTestData([]);
        }
      };

      // fetchAllTestData();
      if (testData.length === 0 || createdTestData.length === 0) {
        fetchAllTestData();
      }
    }, [])
  );

  const deleteSolvedTestEntry = async (testId, timestamp) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const testEntryKeys = allKeys.filter((key) => key.startsWith("solved"));

      for (const key of testEntryKeys) {
        const storedData = await AsyncStorage.getItem(key);

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const storedTimestamp = parsedData.timestamp;
          const numericStoredTimestamp = parseInt(storedTimestamp);

          if (
            parsedData.testId === testId &&
            numericStoredTimestamp === timestamp
          ) {
            await AsyncStorage.removeItem(key);
            console.log(`Removed test entry with key: ${key}`);

            // Update the test data state after removal
            const updatedTestData = testData.filter(
              (entry) =>
                entry.testId !== testId || entry.timestamp !== timestamp
            );
            setTestData(updatedTestData);

            break; // Stop iterating after finding the matching entry
          }
        }
      }
    } catch (error) {
      console.error("Error removing test entry:", error);
    }
  };

  const deleteCreatedTestEntry = async (testId, timestamp) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const testEntryKeys = allKeys.filter((key) => key.startsWith("created"));
      console.log("===testEntryKeys=>" + testEntryKeys);

      for (const key of testEntryKeys) {
        const storedData = await AsyncStorage.getItem(key);

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const storedTimestamp = parsedData.timestamp;
          const numericStoredTimestamp = parseInt(storedTimestamp);

          if (numericStoredTimestamp === timestamp) {
            await AsyncStorage.removeItem(key);
            console.log(`Removed test entry with key: ${key}`);

            const updatedTestData = createdTestData.filter(
              (entry) => entry.timestamp !== timestamp
            );
            setCreatedTestData(updatedTestData);

            break;
          }
        }
      }
    } catch (error) {
      console.error("Error removing test entry:", error);
    }
  };

  const onShareTestIdSolvedTest = async (testId) => {
    try {
      const result = await Share.share({
        message:
          "Get ready to conquer! 🚀 Your Medhikari test code is your key to victory! Share it now and let the world witness your unstoppable drive! 🌟🔥 #MedhikariMagic #CrushTheCompetition" +
          "\n" +
          "\n" +
          "\n" +
          "*" +
          testId +
          "*",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of ", result.activityType);
        } else {
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [groups, setGroups] = useState([]); // State to hold groups data
  const [currentUser, setCurrentUser] = useState("");

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchGroups();
  //   }, [])
  // );

  const fetchGroups = async () => {
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let userId = loginData.user._id;
    setCurrentUser(loginData);
    // setUserData(loginData.user);

    await axios
      .get(`/groups/group/user/${userId}`)
      .then((response) => {
        setGroups(response.data);
        // setGroups([]);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setLoading(false);
      });
  };

  const [testId, setTestId] = useState("");

  const onShareExternal = async () => {
    try {
      const result = await Share.share({
        message:
          "Get ready to conquer! 🚀 Your Medhikari test code is your key to victory! Share it now and let the world witness your unstoppable drive! 🌟🔥 #MedhikariMagic #CrushTheCompetition" +
          "\n" +
          "\n" +
          "\n" +
          "*" +
          testId +
          "*",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type of ", result.activityType);
        } else {
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onShareTestId = (testId) => {
    fetchGroups();
    setModalVisible(true);
    setTestId(testId);
  };

  const updateMessageText = (text) => {
    setMessageText(text);
  };

  const navigateToSummary = (testEntry) => {
    navigation.navigate("SummaryPage", {
      questionData: testEntry.questionData,
      selectedOptions: testEntry.selectedOptions,
    });
  };

  const [activeTab, setActiveTab] = useState("Selected Test");

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const handleTakeTestBtn = () => {
    navigation.navigate("ChooseExam");
  };

  const handleCreateTestBtn = () => {
    navigation.navigate("CustomTestPage");
  };
  const handleShareButton = () => {
    setModalVisible(true);
  };

  const renderSelectedTest = () => (
    <View style={styles.historyScreen}>
      {/* <HeaderMenu /> */}
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6949ff" />
          </View>
        ) : testData.length > 0 ? (
          testData.map((testEntry, index) => (
            <HistoryCard
              key={index}
              testName={testEntry.testId}
              score={testEntry.score}
              testDate={testEntry.timestamp}
              onDelete={() =>
                deleteSolvedTestEntry(testEntry.testId, testEntry.timestamp)
              }
              onSummary={() => navigateToSummary(testEntry)}
            />
          ))
        ) : (
          // <Text>No test data available</Text>
          <View
            style={{
              height: 500,
              backgroundColor: Color.secoundaryBtnColor,
              flex: 1,
            }}
          >
            <LottieView
              source={loadingAnimation} // Replace with your animation JSON file
              autoPlay
              loop={true}
              style={styles.animation}
            />
            <Text style={styles.noHistoryText}>
              Get ready to ace your test! Let's dive in and show what you've
              got!
            </Text>

            {/* <TouchableOpacity style={styles.button} onPress={handleTakeTestBtn}>
              <Text style={styles.buttonText}>Take Test</Text>
            </TouchableOpacity> */}

            <LinearGradient
              colors={["#2196F3", "#3F51B5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.gradientButton,
                {
                  marginVertical: 30,
                  width: "50%",
                  alignSelf: "center",
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleTakeTestBtn}
                style={[styles.button, styles.buttonProp]}
              >
                <Foundation name="target-two" size={24} color="white" />
                <Text style={styles.buttonText}>Take Test</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
      <FooterMenu />
    </View>
  );

  const renderCreatedTest = () => (
    <View style={styles.historyScreen}>
      {/* <HeaderMenu /> */}
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6949ff" />
          </View>
        ) : createdTestData.length > 0 ? (
          createdTestData.map((testEntry, index) => (
            <CreatedTestComponent
              key={index}
              testId={testEntry.response.data.data.testId}
              testName={testEntry.response.data.data.testName}
              questionLength={testEntry.response.data.data.questions.length}
              testDate={testEntry.response.data.data.createdAt}
              onShare={() => onShareTestId(testEntry.response.data.data.testId)}
              //  onShare={() => onShareExternal(testEntry.response.data.data.testId)}

              onView={() => viewCreatedTest(testEntry)}
              onDelete={() =>
                deleteCreatedTestEntry(
                  testEntry.response.data.data.testId,
                  testEntry.timestamp
                )
              }
            />
          ))
        ) : (
          // <Text>No created test data available</Text>
          <View
            style={{
              height: 500,
              backgroundColor: Color.secoundaryBtnColor,
              flex: 1,
            }}
          >
            <LottieView
              source={loadingAnimation} // Replace with your animation JSON file
              autoPlay
              loop={true}
              style={styles.animation}
            />
            <Text style={styles.noHistoryText}>
              Sharing is Caring , Create test Now
            </Text>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={handleCreateTestBtn}
            >
              <Text style={styles.buttonText}>Create Test</Text>
            </TouchableOpacity> */}

            <LinearGradient
              colors={["#FF9800", "#FF5722"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.gradientButton,
                {
                  marginVertical: 30,
                  width: "50%",
                  alignSelf: "center",
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleCreateTestBtn}
                style={[styles.button, styles.buttonProp]}
              >
                <Ionicons name="create" size={24} color="white" />
                <Text style={styles.buttonText}>Create Test</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
      <FooterMenu />
    </View>
  );

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedTestData, setSelectedTestData] = useState([]);

  const viewCreatedTest = (testEntry) => {
    // console.log("-----------" + JSON.stringify(testEntry.response.data.data));
    setSelectedQuestions(testEntry.response.data.data.questions);
    setSelectedTestData(testEntry.response.data.data);
    togglePreviewModal();
  };

  // console.log(
  //   "==================selectedQuestions===========" +
  //     JSON.stringify(selectedQuestions)
  // );

  const getHtml = () => {
    const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Preview</title>
            <style>

            
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                position: relative; /* Ensure relative positioning for the overlay */
        
              }
        
              .background-image {
                position: fixed; /* Fixed position for full-page background */
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1; /* Ensure the background is behind the content */
                opacity: 0.05; /* Adjust the opacity as needed */
                background-image: url('https://i0.wp.com/examtipsindia.com/wp-content/uploads/2022/05/logo.png');
                background-repeat: repeat; /* Adjust as needed */
                background-size: cover;
              }
              
              .container {
                padding: 80px;
                z-index: 1; /* Ensure the content is above the background */
        
              }
              .box-heading {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .question-paper-heading {
                font-size: 18px;
                margin-bottom: 5px;
              }
              .question-paper-heading-text {
                font-weight: bold;
              }
              .border-line {
                border-bottom: 1px solid #000;
                margin: 10px 0;
              }
              .question-container {
                margin-bottom: 20px;
              }
              .question-number {
                font-weight: bold;
                margin-right: 5px;
              }
              .question-text {
                margin-bottom: 10px;
              }
              .option-text {
                margin-left: 20px;
              }
              .answer-text {
                font-style: italic;
                margin-top: 5px;
              }


              .answer-sheet-container {
                page-break-before: always; /* Ensure the container starts on a new page */
                margin-top: 40px; /* Optional margin to separate it from previous content */
                padding: 50px; /* Add padding of 100px */
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              
              th {
                background-color: #f2f2f2;
              }

              h2 {
                color: #6949ff;
                text-align: center;

              }

              .box-template {
                border: 2px solid #000;
                padding: 20px;
                margin: 50px; /* Adjust to make space for the footer */
              }
              
            </style>
          </head>
          <body >

          <div class="background-image"></div>
        
          <div class="container box-template"> <!-- Added box-template class here -->
          <div class="box-heading">Test Preview</div>
              <div class="question-paper-heading">Total Questions : <span class="question-paper-heading-text">${selectedQuestions.length}</span></div>
              <div class="question-paper-heading">Test ID : <span class="question-paper-heading-text">${selectedTestData.testId}</span></div>
              <div class="question-paper-heading">Test Name : <span class="question-paper-heading-text">${selectedTestData.testName}</span></div>
              <div class="border-line"></div>
              ${selectedQuestions
                .map(
                  (question, index) => `
              <div>
                <h3>Question ${index + 1}</h3>
                <p>${question.question}</p>
                <ul>
                  <li>Option 1: ${question.option1}</li>
                  <li>Option 2: ${question.option2}</li>
                  <li>Option 3: ${question.option3}</li>
                  <li>Option 4: ${question.option4}</li>
                </ul>
                <hr />
              </div>
            `
                )
                .join("")}




                <div class="answer-sheet-container">
  <!-- Answer Sheet Heading -->
  <h2>Answer Key</h2>

  <!-- Answer Sheet Table -->
  <table>
    <thead>
      <tr>
        <th>Question No</th>
        <th>Answer</th>
      </tr>
    </thead>
    <tbody>
      ${selectedQuestions
        .map(
          (question, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${question.answer}</td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>
</div>
          
            </div>
          </body>
          </html>
          
        `;
    return html;
  };

  const [selectedPrinter, setSelectedPrinter] = React.useState();

  const print = async () => {
    setLoading(true);
    const html = getHtml();
    // console.log("printhtml :" + html);
    await Print.printAsync({
      html: html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
    setLoading(false);
  };

  const printToFile = async () => {
    setLoading(true);
    const html = getHtml();
    // console.log("fileHtml :" + html);

    const { uri } = await Print.printToFileAsync({ html: html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    setLoading(false);
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={styles.container}>
      <HeaderMenu />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "Selected Test" && styles.activeTab,
          ]}
          onPress={() => handleTabPress("Selected Test")}
        >
          <Text
            // style={styles.tabText}
            style={[
              styles.tabText,
              activeTab === "Selected Test" && styles.activeTabTabText,
            ]}
          >
            Solved Test
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "Created Test" && styles.activeTab,
          ]}
          onPress={() => handleTabPress("Created Test")}
        >
          <Text
            // style={styles.tabText}
            style={[
              styles.tabText,
              activeTab === "Created Test" && styles.activeTabTabText,
            ]}
          >
            Created Test
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View> */}
      {/* Your history cards here */}
      {/* <TouchableOpacity onPress={handleShareButton}>
          <Text>Share</Text>
        </TouchableOpacity> */}
      <GroupSelectionModal
        isVisible={modalVisible}
        groups={groups}
        onClose={() => setModalVisible(false)}
        updateMessageText={updateMessageText}
        shareTestCode={onShareTestId}
        currentUser={currentUser}
        onShareExternal={onShareExternal}
        testId={testId}
      />
      {/* </View> */}

      <View style={styles.tabContent}>
        <Modal
          visible={showPreviewModal}
          animationType="slide"
          transparent={true}
          onRequestClose={togglePreviewModal}
        >
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.boxHeading}>Test Review</Text>

              <Text style={styles.questionPaperHeading}>
                Total Questions :
                <Text style={styles.questionPaperHeadingText}>
                  {selectedQuestions.length}
                </Text>
              </Text>
              <Text style={styles.questionPaperHeading}>
                TestID :
                <Text style={styles.questionPaperHeadingText}>
                  {/* {preparedBy} */}
                  {selectedTestData.testId}
                </Text>
              </Text>
              {/* Test Name */}
              <Text style={styles.questionPaperHeading}>
                Test Name :
                <Text style={styles.questionPaperHeadingText}>
                  {selectedTestData.testName}
                </Text>
              </Text>
              <View style={styles.borderLine} />
              {selectedQuestions.map((question, index) => (
                <View key={question.id} style={styles.questionContainer}>
                  <Watermark text="मी अधिकारी" />

                  <View style={styles.question}>
                    <Text style={styles.questionNumber}>{index + 1}</Text>
                    <Text style={styles.questionText}>{question.question}</Text>
                  </View>
                  <View style={styles.optionsContainer}>
                    <Text style={styles.optionText}>{question.option1}</Text>
                    <Text style={styles.optionText}>{question.option2}</Text>
                    <Text style={styles.optionText}>{question.option3}</Text>
                    <Text style={styles.optionText}>{question.option4}</Text>
                  </View>
                  <Text style={styles.answerText}>
                    {`Correct Answer: ${question.answer}`}
                  </Text>

                  <View style={styles.borderLine} />
                </View>
              ))}
              {/* </ScrollView> */}
            </ScrollView>
            {/* <TouchableOpacity
              onPress={togglePreviewModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close Review</Text>
            </TouchableOpacity> */}
            <LinearGradient
              colors={["#4CAF50", "#8BC34A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientButton, { marginTop: 10 }]}
            >
              <TouchableOpacity
                onPress={togglePreviewModal}
                style={[styles.button, styles.buttonProp]}
              >
                <Ionicons name="close-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Close Preview</Text>
              </TouchableOpacity>
            </LinearGradient>
            <Text
              style={{
                marginVertical: 10,
                color: Color.colorWhite,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              --------- Or --------
            </Text>
            {/* <View style={{ flexDirection: "row", gap: 40, marginBottom: 20 }}>
            <TouchableOpacity onPress={print} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Print</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={printToFile} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Print to file</Text>
            </TouchableOpacity>
          </View> */}
            <View style={{ flexDirection: "row", gap: 40, marginBottom: 20 }}>
              <LinearGradient
                colors={["#FF9800", "#FF5722"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity
                  onPress={print}
                  style={[styles.button, styles.buttonProp]}
                >
                  <MaterialCommunityIcons
                    name="cloud-download"
                    size={24}
                    color="white"
                  />
                  <Text style={styles.buttonText}>Download</Text>
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                colors={["#2196F3", "#3F51B5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity
                  onPress={printToFile}
                  style={[styles.button, styles.buttonProp]}
                >
                  <FontAwesome name="telegram" size={24} color="white" />
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>

        {activeTab === "Selected Test"
          ? renderSelectedTest()
          : renderCreatedTest()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonProp: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
  },
  gradientButton: {
    // flex: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  noHistoryText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: Color.primaryColor,
  },
  animation: {
    width: "100%",
    height: "70%",
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

  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  questionPaperHeadingText: {
    color: Color.colorBlack,
    fontWeight: "bold",
  },
  questionPaperHeading: {
    flexDirection: "row",
    marginBottom: 10,
  },
  boxHeading: {
    color: Color.primaryColor,
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 10,
    alignSelf: "center",
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
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // top: 300,
    backgroundColor: Color.colorWhite,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    gap: 30,
    paddingVertical: 20,
  },
  tabItem: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    // borderBottomColor: Color.primaryColor,
    backgroundColor: Color.primaryColor,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  tabText: {
    fontWeight: "bold",
    color: Color.colorBlack,
  },
  activeTabTabText: {
    fontWeight: "bold",
    color: Color.colorWhite,
  },
  tabContent: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 10,
  },
  bottomSpace: {
    paddingVertical: 60,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  historyScreen: {
    flex: 1,
    // flexGrow: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  card: {
    // top: "10%",
    // marginBottom: "50%",
    // bottom: 50,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default History;
