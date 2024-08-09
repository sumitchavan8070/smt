import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import socketServices from "../utils/sockertService";
import { Feather } from "@expo/vector-icons";

const GroupChatPage = ({ route }) => {
  const navigation = useNavigation();

  const { groupId, groupName, groupIndex, groupMembers, currentUser } =
    route.params;

  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
  const usernames = groupMembers.map((member) => member.username);

  const [messages, setMessages] = useState([]);

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
      const res = await axios.get(`/groups/myMessages/?chatId=${groupId}`);
      setMessages(res.data.data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  const onSend = useCallback(async (messages = []) => {
    try {
      const res = await axios.post("/groups/sendMessage", {
        chatId: groupId,
        text: messages[0]?.text,
        userId: currentUser.user._id,
      });

      socketServices.emit("send_message", {
        ...res.data.data,
        user: {
          _id: currentUser.user._id,
          username: currentUser.user.username,
        },
        button: {
          title: "Solve Paper",
        },
      });
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }, []);

  const handleHeader = () => {
    navigation.navigate("GroupDetailPage", {
      groupName,
      groupMembers,
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
                Total Members: {groupMembers.length}
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
        style={styles.imageBackground}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: currentUser.user._id }}
          renderBubble={(props) => {
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
          }}
          renderSend={(props) => {
            return (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => onSend(props.children.props.text)}
              >
                <Feather name="send" size={24} color={Color.primaryColor} />
              </TouchableOpacity>
            );
          }}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  groupIcon: {
    marginRight: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  groupMembers: {
    fontSize: 10,
  },
  back: {
    marginHorizontal: 10,
    marginRight: 20,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default GroupChatPage;
