// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import HistoryCard from "../Components/Cards/HistoryCard";
// import FooterMenu from "../Components/Menus/FooterMenu";
// import HeaderMenu from "../Components/Menus/HeaderMenu";

// const History = () => {
//   const navigation = useNavigation();

//   const [testData, setTestData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllTestData = async () => {
//       try {
//         const allKeys = await AsyncStorage.getAllKeys();
//         const filteredKeys = allKeys.filter((key) => key !== "@auth");
//         const data = await AsyncStorage.multiGet(filteredKeys);

//         const testDataArray = data.map(([key, value]) => {
//           const entry = JSON.parse(value);
//           const date = new Date(parseInt(entry.timestamp));
//           const formattedDate = `${date.getDate()}/${
//             date.getMonth() + 1
//           }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
//           return { ...entry, timestamp: formattedDate };
//         });

//         setTestData(testDataArray);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching test data:", error);
//         setLoading(false);
//       }
//     };
//     fetchAllTestData();
//   }, []);

//   const deleteTestEntry = async (index) => {
//     const updatedTestData = [...testData];
//     updatedTestData.splice(index, 1);
//     setTestData(updatedTestData);
//     await AsyncStorage.clear();
//     updatedTestData.forEach(async (entry) => {
//       await AsyncStorage.setItem(
//         `testEntry_${entry.testDate}`,
//         JSON.stringify(entry)
//       );
//     });
//   };

//   const navigateToSummary = (testEntry) => {
//     navigation.navigate("SummaryPage", {
//       questionData: testEntry.questionData,
//       selectedOptions: testEntry.selectedOptions,
//     });
//   };

//   return (
//     <View style={styles.historyScreen}>
//       <HeaderMenu />
//       <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#6949ff" />
//           </View>
//         ) : testData.length > 0 ? (
//           testData.map((testEntry, index) => (
//             <HistoryCard
//               key={index}
//               testName={testEntry.questionData[0].qpName}
//               score={testEntry.questionData[0].scorePercentage}
//               testDate={testEntry.timestamp}
//               onDelete={() => deleteTestEntry(index)}
//               onSummary={() => navigateToSummary(testEntry)}
//             />
//           ))
//         ) : (
//           <Text>No test data available</Text>
//         )}

//         <View style={styles.bottomSpace} />
//       </ScrollView>
//       <FooterMenu />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bottomSpace: {
//     paddingVertical: 60,
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
//   historyScreen: {
//     flex: 1,
//     // flexGrow: 1,
//     width: "100%",
//     backgroundColor: "#fff",
//   },
//   card: {
//     // top: "10%",
//     // marginBottom: "50%",
//     // bottom: 50,
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default History;

//

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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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

const History = () => {
  const navigation = useNavigation();

  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createdTestData, setCreatedTestData] = useState([]);

  useEffect(() => {
    const fetchAllTestData = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const filteredKeys = allKeys.filter((key) => key !== "@auth");

        const data = await AsyncStorage.multiGet(filteredKeys);

        const testDataArray = [];
        const createdTestDataArray = [];

        data.forEach(([key, value]) => {
          const entry = JSON.parse(value);
          // const date = new Date(parseInt(entry.timestamp));
          // const formattedDate = `${date.getDate()}/${
          //   date.getMonth() + 1
          // }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

          // const dataObject = { ...entry, timestamp: formattedDate };

          // if (key === "@createdTest") {
          //   createdTestDataArray.push(dataObject);
          // } else {
          //   testDataArray.push(dataObject);
          // }

          if (key.includes("createdTest")) {
            createdTestDataArray.push(entry);
          } else {
            testDataArray.push(entry);
          }
        });

        setTestData(testDataArray);
        setCreatedTestData(createdTestDataArray);
        // console.log("----------" + JSON.stringify(testDataArray));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setLoading(false);
        // Alert.alert("Error fetching test data. Please try again later.");
        setTestData([]);
      }
    };

    // fetchAllTestData();
    if (testData.length === 0 || createdTestData.length === 0) {
      fetchAllTestData();
    }
  }, []);

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
          <View>
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

            <TouchableOpacity style={styles.button} onPress={handleTakeTestBtn}>
              <Text style={styles.buttonText}>Take Test</Text>
            </TouchableOpacity>
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
          <View>
            <LottieView
              source={loadingAnimation} // Replace with your animation JSON file
              autoPlay
              loop={true}
              style={styles.animation}
            />
            <Text style={styles.noHistoryText}>
              Sharing is Caring , Create test Now
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateTestBtn}
            >
              <Text style={styles.buttonText}>Create Test</Text>
            </TouchableOpacity>
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
                    {/* {question.options.map((option, optionIndex) => (
                      <Text key={optionIndex} style={styles.optionText}>
                        {`Option${optionIndex + 1}: ${option}`}
                      </Text>
                    ))} */}
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
            <TouchableOpacity
              onPress={togglePreviewModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close Review</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "50%",
    alignSelf: "center",
    // justifyContent: "center",
    marginVertical: 20,
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
