import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome 5
import { Color } from "../GlobalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { io } from "socket.io-client"; // Import Socket.io client
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import socketServices from "../utils/sockertService";

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
  } = route.params;

  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
  const usernames = groupMembers.map((member) => member.username);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [showShareTestModal, setShowShareTestModal] = useState(false);

  const [page, setPage] = useState(1);

  useEffect(() => {
    apiHit();
  }, []);

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

  const apiHit = async () => {
    try {
      // const res = await actions.myMessages(
      //   `?chatId=${roomId}&limit=${limit}&page=${page}`
      // );

      const res = await axios.get(`/groups/myMessages/?chatId=${groupId}`);

      // console.log("myMessages res++++", res.data.data);
      setMessages(res.data.data);
    } catch (error) {
      console.log("error raised", error);
    }
  };

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Hello developer",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //         // avatar: "https://placeimg.com/140/140/any",
  //       },
  //     },
  //   ]);
  // }, []);

  // const onSend = useCallback(async (messages = []) => {
  //   try {
  //     const res = await axios.post("/groups/sendMessage", {
  //       chatId: groupId,
  //       text: messages[0]?.text,
  //       userId: currentUser.user._id,
  //     });

  //     console.log("Success", res);
  //     // await apiHit();

  //     // console.log("======>" + JSON.stringify(res.data.data));
  //     socketServices.emit("send_message", {
  //       ...res.data.data,
  //       user: {
  //         _id: currentUser.user._id,
  //         username: currentUser.user.username,
  //       },
  //     });
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  //   // setMessages((previousMessages) =>
  //   //   GiftedChat.append(previousMessages, messages)
  //   // );
  // }, []);

  // const onPressBubble = (props) => {
  //   console.log("====" + JSON.stringify(props.id));
  // };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Color.green, // Customize left bubble background color
          },
          right: {
            backgroundColor: "#007AFF", // Customize right bubble background color
          },
        }}
      ></Bubble>
    );
  };

  const createMessage = (testId, testName, totalQuestions) => {
    return {
      _id: Math.random().toString(),
      text: `TestId: ${testId}\nName: ${testName}\nTotal Questions: ${totalQuestions}`,
      createdAt: new Date(),
      user: {
        _id: currentUser.user._id,
        name: currentUser.user.username,
      },
      // Custom data for rendering in the UI
      custom: {
        testId,
        testName,
        totalQuestions,
      },
      clickableText: "Attempt Questions", // Clickable text to be displayed in the message
    };
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    return (
      <View>
        <Bubble {...props} />
        <TouchableOpacity
          onPress={() => handlePressLink(currentMessage.custom.testId)}
        >
          <Text style={styles.clickableText}>
            {currentMessage.clickableText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const handlePressLink = (testId) => {
    // Handle click logic here, e.g., log the test ID
    console.log("Clicked Test ID:", testId);
  };
  const onSend = useCallback((messages = []) => {
    // Handle sending logic here, e.g., sending the message to the server
    const testId = "123"; // Example test ID
    const testName = "Sample Test";
    const totalQuestions = 10; // Example total questions
    const message = createMessage(testId, testName, totalQuestions);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );
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
    navigation.navigate("CommomScreen");
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
                {" "}
                Total Members : {""}
                {groupMembers.length}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <FontAwesome5 name="ellipsis-v" size={20} style={styles.listMenu} />
          </View>
        </View>
      </TouchableOpacity>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser.user._id,
        }}
        renderBubble={renderBubble}
        // onPress={onPressBubble}
        renderMessage={renderMessage}
      />
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
    // padding: 20,
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
