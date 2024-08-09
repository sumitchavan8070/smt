import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Animated,
  Share,
  FlatList,
} from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Color } from "../../GlobalStyles";
import * as Clipboard from "expo-clipboard";
import loadingAnimation from "../../assets/share.json";
import LottieView from "lottie-react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingAnimation from "../Loader/loader";
import { AntDesign } from "@expo/vector-icons";

const CustomTestAlert = ({
  isVisible,
  testId,
  onClose,
  onSkipIntructions,
  message,
  onShareExternal,
}) => {
  if (!isVisible) return null;
  const navigation = useNavigation();

  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);

  const startScaleAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(testId);
    alert(
      `Your shareable Test ID: ${testId} has been copied to your clipboard.`
    );
  };

  const handleShareTest = async () => {
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
          4;
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShareOnWhatsapp = () => {
    // Add logic to share on WhatsApp
    // onShareExternal();
    handleShareTest();
  };

  const handleShareOnTelegram = () => {
    // Add logic to share on Telegram
    // onShareExternal();
    handleShareTest();
  };
  const [groups, setGroups] = useState([]); // State to hold groups data
  const [currentUser, setCurrentUser] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [])
  );

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

  const handleGroupSelect = (group) => {
    navigation.navigate("GroupChatPage", {
      groupId: group._id,
      groupName: group.name,
      groupMembers: group.members,
      groupInfo: group,
      currentUser,
      sharedTestId: testId,
    });
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleGroupSelect(item)}
      style={styles.groupItem}
    >
      <FontAwesome name="group" style={styles.groupIcons} />
      <Text style={{ color: Color.colorBlack }}>{item.name}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color="#666"
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  const handleCreateGroup = () => {
    // console.log("Im Clicked");
    navigation.navigate("CommonScreen");
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <View style={styles.card}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          {/* <Text style={styles.closeButtonText}>Close</Text> */}
          <AntDesign name="closecircleo" style={styles.closeButtonText} />
        </TouchableOpacity>

        <LottieView
          source={loadingAnimation} // Replace with your animation JSON file
          autoPlay
          loop={true}
          style={styles.animation}
        />
        {/* <Text style={styles.message}>{message}</Text> */}
        <Text style={styles.message}>
          Congratulations! <Text style={styles.username}>{message}</Text>
        </Text>
        <Text style={styles.messageBody}>
          Your test is all set and ready to share with a single click!
        </Text>
        <View style={styles.testIdContainer}>
          <Text style={styles.testIdText}>{testId}</Text>
          <TouchableOpacity
            style={styles.copyIcon}
            onPress={() => {
              startScaleAnimation();
              copyToClipboard();
            }}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <FontAwesome5 name="copy" size={20} color={Color.primaryColor} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.socialbuttonContainer}>
          <TouchableOpacity
            onPress={handleShareOnWhatsapp}
            style={[styles.shareButton, { backgroundColor: "#25D366" }]}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.buttonText}>Share on WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShareOnTelegram}
            style={[styles.shareButton, { backgroundColor: "#0088cc" }]}
          >
            <FontAwesome name="telegram" size={24} color="white" />
            <Text style={styles.buttonText}>Share on Telegram</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orLine}>--------- OR ---------</Text>

        {/* <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.flatListContainer}
        /> */}
        {groups.length === 0 ? (
          <TouchableOpacity
            style={styles.createGrpBtn}
            onPress={handleCreateGroup}
          >
            <FontAwesome
              name="group"
              style={{ color: Color.colorWhite, fontSize: 20 }}
            />
            <Text style={{ color: Color.colorWhite, fontWeight: "bold" }}>
              Create Own Group
            </Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  createGrpBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Color.primaryColor,
    flexDirection: "row",
    gap: 15,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    paddingBottom: 30,
  },
  orLine: {
    paddingVertical: 10,
    alignSelf: "center",
    marginTop: 10,
    fontSize: 16,
    color: Color.primaryColor,
  },
  groupIcons: {
    fontSize: 24,
    color: Color.primaryColor,
    paddingHorizontal: 10,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  icon: {
    marginLeft: "auto",
  },
  socialbuttonContainer: {
    width: "80%",
    alignSelf: "center",
    gap: 20,
    marginTop: 5,
    paddingHorizontal: 30,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  username: {
    color: Color.primaryColor,
  },
  animation: {
    width: "100%",
    height: 150,
    alignSelf: "center",
  },
  copyIcon: {
    // right: 10,
  },
  buttonContainer: {
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignSelf: "center",
  },
  testIdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Color.secoundaryBtnColor,
    marginVertical: 20,
    width: "95%",
  },
  testIdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Color.primaryColor,
    marginRight: 20,
    alignSelf: "center",
    left: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
    justifyContent: "center",
    // top: 100,
    alignItems: "center",
    zIndex: 999, // Ensure the alert card is on top
  },
  card: {
    backgroundColor: Color.colorWhite,
    width: "90%",
    height: "90%",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10, // Add elevation for Android shadow
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    // marginBottom: 20,
    color: Color.colorBlack,
    fontWeight: "bold",
    // paddingVertical: 20,
  },

  messageBody: {
    fontSize: 16,
    textAlign: "center",
    color: Color.colorBlack,
    // fontWeight: "bold",
    paddingVertical: 5,
  },
  closeButton: {
    // backgroundColor: Color.green,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 5,
    // marginHorizontal: 5,
  },
  buttonShare: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
  },
  closeButtonText: {
    color: Color.extraRed,
    fontWeight: "bold",
    fontSize: 25,
    alignSelf: "flex-end",
    marginLeft: "90%",
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
});

export default CustomTestAlert;
