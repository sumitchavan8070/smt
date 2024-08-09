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

  useEffect(() => {
    apiHit();
  }, []);

  useEffect(() => {
    socketServices.emit("join_room", groupId);

    socketServices.on("send_message", (data) => {
      // console.log("Received message:", data); // Add this line to check if messages are received

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
      const res = await axios.get(`/groups/myMessages/?chatId=${groupId}`);
      // console.log("Fetched messages:", res.data.data); // Add this line to check if messages are fetched
      setMessages(res.data.data);
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const onSend = useCallback(async (messages = []) => {
    try {
      const res = await axios.post("/groups/sendMessage", {
        chatId: groupId,
        text: messages[0]?.text,
        userId: currentUser.user._id,
        buttonTitle: "Solve Paper",
      });

      // console.log("Success", res);

      socketServices.emit("send_message", {
        ...res.data.data,
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

      <ImageBackground
        source={require("../assets/wtsback.png")}
        style={{ height: "auto", width: "auto", flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: currentUser.user._id }}
          renderMessage={(props) => {
            const { currentMessage } = props;
            if (currentMessage.button) {
              return (
                <View style={styles.messageContainer}>
                  <Bubble
                    {...props}
                    textStyle={{
                      right: {
                        color: "#000",
                      },
                    }}
                    timeTextStyle={{
                      left: { color: "black" },
                      right: { color: "black" },
                    }} // Set color for time text
                    dateTextStyle={{
                      left: { color: "black" },
                      right: { color: "black" },
                    }} // Set color for date text
                    wrapperStyle={{
                      left: {
                        backgroundColor: "#fff", // Color for left messages
                        width: 200, // Adjust the width as needed
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        // marginBottom: 8,
                        marginLeft: 10,
                      },
                      right: {
                        backgroundColor: "#D9FDD3", // Color for right messages
                        width: 200, // Adjust the width as needed
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        // marginBottom: 8,
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
                        width: 200, // Adjust button width as needed
                        alignSelf:
                          props.position === "right"
                            ? "flex-end"
                            : "flex-start", // Align button based on position
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
                      // Perform button action here
                      Alert.alert("You did it!! : " + currentMessage.text);
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
            // Render regular message bubble if no button is present
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "#000",
                  },
                }}
                timeTextStyle={{
                  left: { color: "black" },
                  right: { color: "black" },
                }} // Set color for time text
                dateTextStyle={{
                  left: { color: "black" },
                  right: { color: "black" },
                }} // Set color for date text
                wrapperStyle={{
                  left: {
                    backgroundColor: "#fff", // Color for left messages
                    width: 200,
                    marginBottom: 8,
                    marginLeft: 10,
                  },
                  right: {
                    backgroundColor: "#D9FDD3", // Color for right messages
                    width: 200,
                    marginBottom: 8,
                    marginRight: 10,
                  },
                }}
              />
            );
          }}
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
    // padding: 20,
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
