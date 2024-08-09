import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome 5
import { Color } from "../GlobalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { io } from "socket.io-client"; // Import Socket.io client
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import socketServices from "../utils/sockertService";
import ParsedText from "react-native-parsed-text";
import { Feather } from "@expo/vector-icons";
import CustomInputToolbar from "../Components/Group/CustomInputToolbar";
import LoadingAnimation from "../Components/Loader/loader";
import ChooseExamAlertSuccess from "../Components/Alert/ChooseExamAlertSuccess";

const limit = 50;
const GroupChatPage = ({ route }) => {
  const navigation = useNavigation();

  const {
    groupId,
    groupName,
    groupIcon,
    groupIndex,
    groupMembers,
    groupInfo,
    currentUser,
    sharedTestId,
  } = route.params;

  // console.log("==sharedTestId===>" + sharedTestId);

  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
  // const usernames = groupMembers.map((member) => member.username);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // console.log("==Groupid===>" + groupId);
  //   apiHit(groupId);
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      apiHit(groupId);
      if (sharedTestId) {
        console.log();
        setModalVisible(true);
      }
    }, [])
  );
  useEffect(() => {
    socketServices.emit("join_room", groupId);

    socketServices.on("send_message", (data) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, data)
      );
    });

    return () => {
      socketServices.removeListener("send_message");
      socketServices.emit("leave_room", groupId);
    };
  }, []);

  const apiHit = async (groupId) => {
    try {
      const res = await axios.get(`/groups/myMessages/?chatId=${groupId}`);
      setMessages(res.data.data);
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const onSend = useCallback(async (messages = []) => {
    try {
      if (!messages[0]?.text) {
        alert("Message should not be empty");
        return;
      }
      const res = await axios.post("/groups/sendMessage", {
        chatId: groupId,
        text: messages[0]?.text,
        userId: currentUser.user._id,
        buttonTitle: "Solve Paper",
      });
      // console.log("====>" + JSON.stringify(res.data.roomData));
      socketServices.emit("send_message", {
        ...res.data.data,
        chatId: groupId,
        // userId: currentUser.user._id,
        roomData: res.data.roomData,
        user: {
          _id: currentUser.user._id,
          username: currentUser.user.username,
        },
      });
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  const handleHeader = () => {
    navigation.navigate("GroupDetailPage", {
      groupName,
      groupMembers,
      groupInfo,
      groupIndex,
      groupId,
    });
  };

  const handleBack = () => {
    navigation.navigate("CommonScreen");
  };

  const onPlusPress = () => {
    console.log("Plus icon pressed");
    // You can add your logic for handling plus icon press here
  };

  const [showAlertTest, setShowAlertTest] = useState(false);
  const [alertMessageTest, setAlertMessageTest] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [testId, setTestId] = useState("");

  const getCustomTestById = async (testId) => {
    try {
      setLoading(true);

      const response = await axios.get(`/customtest/custom-test/${testId}`);
      // const testData = response.data;
      if (response.data) {
        // console.log("Custom test data:", testData);
        const questionData = response.data.data[0].questions;
        // console.log("=====>:", response.data.data[0].testId);
        // navigation.navigate("TestPage", {
        //   questionData,
        //   testId,
        // });
        setQuestionData(questionData);
        setTestId(testId);
        setShowAlertTest(true);
        setAlertMessageTest("Quick Tips: There are no Tips. Best of luck!");
        setLoading(false);
      } else {
        console.log("Custom test not found.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };

  const handleOnInstructions = () => {
    navigation.navigate("InstructionPage", {
      questionData,
      testId,
    });
  };

  const handleOnSkipIntructions = () => {
    // console.log("Skip is Clicked");
    navigation.navigate("TestPage", {
      questionData,
      testId,
    });
  };

  const onCloseChooseExamAlert = () => {
    setShowAlertTest(false);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalToggle = () => {
    setModalVisible(!modalVisible); // Toggle modal visibility
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHeader}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack}>
              <FontAwesome5 name="arrow-left" size={20} style={styles.back} />
            </TouchableOpacity>
            <FontAwesome5
              name="users"
              size={30}
              style={[
                styles.groupIcon,
                { color: colorTray[groupIndex % colorTray.length] },
              ]}
            />
            <View>
              <Text style={styles.groupName}>{groupName}</Text>

              <Text style={styles.groupMembers}>
                Total Members: {groupMembers.length}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {/* <FontAwesome5 name="ellipsis-v" size={20} style={styles.listMenu} /> */}
          </View>
        </View>
      </TouchableOpacity>

      <ImageBackground
        source={require("../assets/wtsback.png")}
        style={{ height: "auto", width: "auto", flex: 1 }}
      >
        {loading && <LoadingAnimation visible={loading} loop={true} />}

        {showAlertTest && (
          <ChooseExamAlertSuccess
            isVisible={showAlertTest}
            onInstructions={handleOnInstructions}
            onSkipIntructions={handleOnSkipIntructions}
            message={alertMessageTest}
            onClose={onCloseChooseExamAlert}
          />
        )}

        <GiftedChat
          messages={messages}
          // onSend={onSend}
          user={{ _id: currentUser.user._id }}
          renderInputToolbar={(props) => (
            // <CustomInputToolbar
            //   // onPlusPress={onPlusPress}
            //   // onSendPress={() => onSend(props)}
            //   onSendPress={onSend}
            // />
            <CustomInputToolbar
              {...props}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              sharedTestId={sharedTestId}
              onSendPress={(text) => onSend([{ text }])}
            />
          )}
          alwaysShowSend
          // renderUsernameOnMessage={true}
          renderMessage={React.useCallback((props) => {
            const { currentMessage } = props;

            if (currentMessage.button) {
              return (
                <View style={styles.messageContainer}>
                  <Bubble
                    {...props}
                    textStyle={{ right: { color: "#000" } }}
                    timeTextStyle={{
                      left: {
                        color: "black",
                        marginLeft: "75%",
                      },
                      right: { color: "black" },
                    }}
                    dateTextStyle={{
                      left: { color: "black" },
                      right: { color: "black" },
                    }}
                    wrapperStyle={{
                      left: {
                        backgroundColor: "#fff",
                        width: 200,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginLeft: 10,
                      },
                      right: {
                        backgroundColor: "#D9FDD3",
                        width: 200,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        marginRight: 10,
                      },
                    }}
                  />
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        marginBottom: 5,
                        borderTopRightRadius: 0,
                        borderTopLeftRadius: 0,
                        backgroundColor:
                          props.position === "right" ? "#D9FDD3" : "#fff",
                        borderRadius: 10,
                        padding: 8,
                        marginLeft: 8,
                        width: 200,
                        alignSelf:
                          props.position === "right"
                            ? "flex-end"
                            : "flex-start",
                        marginRight: props.position === "right" ? 10 : 0,
                        marginLeft: props.position === "left" ? 10 : 0,
                        borderTopColor: "#fff",
                        borderBottomColor:
                          props.position === "right" ? "#D9FDD3" : "#fff",
                        borderRightColor:
                          props.position === "right" ? "#D9FDD3" : "#fff",
                        borderLeftColor:
                          props.position === "right" ? "#D9FDD3" : "#fff",
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      console.log("Button pressed!");
                      // console.log(
                      //   "====>" + JSON.stringify(currentMessage.text)
                      // );
                      // console.log(
                      //   "==ID==>" +
                      //     currentMessage.text.split("\n")[0].split(":")[1]
                      // );
                      // Alert.alert("You did it!! : " + currentMessage.text);
                      // setClickedTestId(
                      //   currentMessage.text.split("\n")[0].split(":")[1]
                      // );

                      getCustomTestById(
                        currentMessage.text.split("\n")[0].split(":")[1]
                      );
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="book-open" size={20} color="blue" />
                      <Text style={{ color: "blue", alignSelf: "center" }}>
                        {currentMessage.button.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <Bubble
                {...props}
                textStyle={{ right: { color: "#000" } }}
                timeTextStyle={{
                  left: { color: "black" },
                  right: { color: "black" },
                }}
                dateTextStyle={{
                  left: { color: "black" },
                  right: { color: "black" },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: "#fff",
                    width: 200,
                    marginBottom: 8,
                    marginLeft: 10,
                  },
                  right: {
                    backgroundColor: "#D9FDD3",
                    width: 200,
                    marginBottom: 8,
                    marginRight: 10,
                  },
                }}
              />
            );
          }, [])} // Memoize renderMessage with useCallback
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  groupMembers: { fontSize: 10 },
  back: {
    marginHorizontal: 10,
    marginRight: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: Color.colorWhite,
    paddingTop: 40,
    padding: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  groupIcon: {
    marginRight: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default GroupChatPage;
