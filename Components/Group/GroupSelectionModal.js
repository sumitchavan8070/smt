import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Example of using Ionicons for icons
import { Color } from "../../GlobalStyles";
import loadingAnimation from "../../assets/share.json";
import LottieView from "lottie-react-native";

const GroupSelectionModal = ({
  isVisible,
  groups,
  onClose,
  updateMessageText,
  shareTestCode,
  currentUser,
  onShareExternal,
  testId,
}) => {
  const navigation = useNavigation();
  const [selectedGroup, setSelectedGroup] = useState(null);

  // console.log("Test id in Modal ===>" + testId);

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
      <Text style={styles.groupName}>{item.name}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color="#666"
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  const handleShareOnWhatsapp = () => {
    // Add logic to share on WhatsApp
    onShareExternal();
  };

  const handleShareOnTelegram = () => {
    // Add logic to share on Telegram
    onShareExternal();
  };

  const handleCreateGroup = () => {
    // console.log("Im Clicked");
    navigation.navigate("CommonScreen");
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <LottieView
            source={loadingAnimation} // Replace with your animation JSON file
            autoPlay
            loop={true}
            style={styles.animation}
          />

          <Text style={styles.modalHeader}>
            Let's Share the Test Among Groups!
          </Text>

          <View style={styles.buttonContainer}>
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
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
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
    width: "60%",
    alignSelf: "center",
  },
  groupIcons: {
    fontSize: 24,
    color: Color.primaryColor,
    paddingHorizontal: 10,
  },
  orLine: {
    paddingVertical: 10,
    alignSelf: "center",
    marginTop: 10,
    fontSize: 16,
    color: Color.primaryColor,
  },
  buttonContainer: {
    width: "80%",
    alignSelf: "center",
    gap: 20,
    marginTop: 20,
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
  animation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Color.primaryColor,
    alignSelf: "center",
    marginBottom: 10,
  },
  popupContainer: {
    backgroundColor: Color.colorWhite,
    borderRadius: 10,
    width: "95%",
    maxHeight: "90%",
    padding: 20,
    paddingBottom: 30,
  },
  flatListContainer: {
    paddingBottom: 20,
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
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 20,
  },
});

export default GroupSelectionModal;
