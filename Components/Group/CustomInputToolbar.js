import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  Alert,
  Keyboard,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { Color } from "../../GlobalStyles";
import {
  Entypo,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import loadingAnimation from "../../assets/share.json";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const CustomInputToolbar = ({
  onSendPress,
  onShareTestId,
  modalVisible,
  setModalVisible,
  sharedTestId,
}) => {
  const navigation = useNavigation();

  const [messageText, setMessageText] = useState("");
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    if (sharedTestId) {
      setMessageText(sharedTestId);
    }
  }, []);

  const verifyTestId = async () => {
    try {
      if (!messageText) {
        alert("Please Enter Valid Test ID");
        return;
      }
      if (messageText) {
        const response = await axios(`/customtest/custom-test/${messageText}`);
        setTestDetails(response.data);
        Keyboard.dismiss();
      }
    } catch (error) {
      Keyboard.dismiss();
      setModalVisible(false);
      alert("Please Enter Valid Test ID");
      console.error("Error verifying test ID:", error);
    }
  };

  const handleSend = () => {
    const data =
      "Test ID :" +
      testDetails.data[0].testId +
      "\n" +
      "Test Name :" +
      testDetails.data[0].testName +
      "\n" +
      "Total Questions :" +
      testDetails.data[0].totalQuestions;
    //   console.log(data);

    onSendPress(data); // Pass the message text to the onSendPress function
    setMessageText(""); // Clear the input box after sending
    setTestDetails(null); // Clear test details
    setModalVisible(false); // Close the modal after sending
  };

  const onCreatePress = () => {
    navigation.navigate("CustomTestPage");
  };

  const onSearchPress = () => {
    navigation.navigate("History", { tabScreen: "Created Test" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconView}>
        <TouchableOpacity onPress={onCreatePress}>
          <Ionicons name="create" style={styles.iconViewStyle} />
          {/* <Text>Create Test</Text> */}
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            setMessageText(""); // Clear the input box after sending
            setTestDetails(null);
            setModalVisible(true);
          }}
        >
          <FontAwesome5 name="plus" style={styles.footerIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.iconView}>
        <TouchableOpacity onPress={onSearchPress}>
          <MaterialCommunityIcons
            name="text-box-search"
            style={styles.iconViewStyle}
          />
          {/* <Text>Search Test</Text> */}
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <SimpleLineIcons name="close" style={styles.closeIcon} />
            </TouchableOpacity>

            <LottieView
              source={loadingAnimation} // Replace with your animation JSON file
              autoPlay
              loop={true}
              style={styles.animation}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter test ID"
              value={messageText}
              onChangeText={setMessageText}
            />
            {/* <TouchableOpacity
              style={styles.verifyButton}
              onPress={verifyTestId}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity> */}

            {testDetails === null ? (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={verifyTestId}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: "green" }}>
                Please Review the Question Paper details
              </Text>
            )}

            {testDetails && (
              <View style={styles.testDetailsContainer}>
                <Text>
                  Test ID : <Text>{testDetails.data[0].testId}</Text>
                </Text>
                <Text>
                  Test Name : <Text>{testDetails.data[0].testName}</Text>
                </Text>
                <Text>
                  Total Questions :
                  <Text>{testDetails.data[0].totalQuestions}</Text>
                </Text>
              </View>
            )}
            <View style={styles.buttonsContainer}>
              {testDetails && (
                <>
                  <View style={styles.closeButton}>
                    <Ionicons name="exit" size={20} style={styles.sendIcon} />
                    <TouchableOpacity
                      // style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.sendButton}>
                    <Entypo
                      name="paper-plane"
                      size={20}
                      style={styles.sendIcon}
                    />
                    <TouchableOpacity
                      // style={styles.sendButton}
                      onPress={handleSend}
                    >
                      <Text style={styles.sendButtonText}>Share Test</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    fontSize: 24,
    alignSelf: "flex-end",
    color: Color.extraRed,
  },
  iconViewStyle: {
    color: Color.primaryColor,
    fontSize: 30,
    paddingHorizontal: 20,
  },
  iconView: {
    alignItems: "center",
    bottom: "2%",
  },
  footerIcon: {
    fontSize: 24,
    color: Color.colorWhite,
  },
  animation: {
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
  sendIcon: {
    color: Color.colorWhite,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    // marginBottom: 50,
    justifyContent: "space-between",
    backgroundColor: Color.colorWhite,
    borderRadius: 30,
    // bottom: "2%",
  },
  iconContainer: {
    // marginHorizontal: 8,
    // position: "absolute",
    bottom: "5%",
    // right: 20,
    backgroundColor: "#6949ff",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    alignSelf: "center",
    gap: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: Color.primaryColor,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
  },
  verifyButton: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  testDetailsContainer: {
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  closeButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Color.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sendButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomInputToolbar;
