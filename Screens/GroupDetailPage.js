import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Share,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../GlobalStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddMemberModel from "../Components/Group/AddMemberModel";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

const GroupDetailPage = ({ route }) => {
  const { groupId, groupName, groupIcon, groupIndex, groupMembers, groupInfo } =
    route.params;

  const navigation = useNavigation();
  const [showAddMemberModel, setShowAddMemberModel] = useState(false);
  const [members, setMembers] = useState(groupMembers);

  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
  const isAdminMember = (userId) => userId === groupInfo.creatorId;

  const adminMemberIndex = members.findIndex(
    (member) => member.userId === groupInfo.creatorId
  );

  const adminMember = members[adminMemberIndex];
  const filteredMembers = members.filter(
    (member) => member.userId !== groupInfo.creatorId
  );

  const removeMember = async (item, memberUserId) => {
    // console.log("groupInfo" + JSON.stringify(groupInfo._id));
    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;
      if (!(userId === groupInfo.creatorId)) {
        // User is not admin, show alert
        Alert.alert(
          "Alert",
          "You are not an admin. Only admin can remove members.",
          [{ text: "OK", onPress: () => console.log("OK pressed") }]
        );
        return;
      }

      Alert.alert(
        "Confirmation",
        "Are you sure you want to remove this member?",
        [
          {
            text: "No",
            onPress: () => console.log("No pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              sendRemoveRequest(memberUserId);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const sendRemoveRequest = async (memberUserId) => {
    try {
      const response = await axios.delete(
        `/groups/member/delete/${groupInfo._id}/${memberUserId}`
      );
      Alert.alert(response.data.message);
      setMembers(response.data.data.members);
    } catch (error) {
      Alert.alert("Error", "Failed to remove member. Please try again.");
    }
  };

  const sendLeftRequest = async (memberUserId) => {
    try {
      const response = await axios.delete(
        `/groups/member/left/${groupInfo._id}/${memberUserId}`
      );
      Alert.alert(response.data.message);
      // setMembers(response.data.data.members);
      navigation.navigate("CommonScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to leave group. Please try again.");
    }
  };

  const renderMemberItem = ({ item, index }) => {
    const isCurrentUserAdmin = item.userId === groupInfo.creatorId; // Check if item.userId matches the admin ID
    // console.log("isCurrentUserAdmin" + isCurrentUserAdmin);
    return (
      <View style={styles.memberItem}>
        {/* Profile Picture or Default Icon */}
        {item.profilePic ? (
          <Image source={item.profilePic} style={styles.memberProfilePic} />
        ) : (
          <FontAwesome5
            name="user-circle"
            size={40}
            style={[
              styles.memberProfileIcon,
              { color: colorTray[index % colorTray.length] },
            ]}
          />
        )}

        <View>
          {/* Member Name and Username */}
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberUsername}>{item.username}</Text>
        </View>

        {/* Admin or Member Tag */}
        {isCurrentUserAdmin ? (
          <Text style={styles.adminIcon}>Admin</Text>
        ) : (
          <TouchableOpacity
            style={styles.removeIcon}
            onPress={() => removeMember(item, item.userId, item.groupId)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const handleAddMember = () => {
    // console.log("Add Member Clicked");
    setShowAddMemberModel(true);
  };

  const handleModelClose = async () => {
    setShowAddMemberModel(false);
    try {
      const response = await axios.get(`/groups//group/${groupId}`);
      setMembers(response.data.members);
    } catch (error) {
      console.log("Error while setting the Members" + error);
    }
  };

  const sendDeleteGroup = async (id) => {
    try {
      const response = await axios.delete(`/groups//group/delete/${id}`);
      // fetchUpdatedMembers();
      console.log(response.data.message);
      Alert.alert(response.data.message);
      navigation.navigate("CommonScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to delete group. Please try again.");
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;

      if (!(userId === groupInfo.creatorId)) {
        // User is not admin, show alert
        Alert.alert(
          "Alert",
          "You are not an admin. Only admin can Delete Group.",
          [{ text: "OK", onPress: () => console.log("OK pressed") }]
        );
        return;
      }

      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this Group?",
        [
          {
            text: "No",
            onPress: () => console.log("No pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              sendDeleteGroup(groupInfo._id);
            },
          },
        ]
      );
    } catch (error) {
      // Handle error
      console.error("Error deleting group:", error);
    }
  };

  const scaleValue = React.useRef(new Animated.Value(1)).current;

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
    await Clipboard.setStringAsync(groupInfo.GroupShareId);
    alert(
      `Your shareable Group ID: ${groupInfo.GroupShareId} has been copied to your clipboard.`
    );
  };

  const handleShareGroupCode = async () => {
    try {
      const id = groupInfo.GroupShareId;

      const result = await Share.share({
        message:
          "Join the journey of excellence! 🚀 Together, we will unlock the doors to success! Join group and ignite the spirit of achievement! 🌟🔥 #TeamTriumph #UnleashYourPotential" +
          "\n" +
          "\n" +
          "\n" +
          "*" +
          id +
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

  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          let data = await AsyncStorage.getItem("@auth");
          let loginData = JSON.parse(data);
          let userId = loginData.user._id;
          setIsUserAdmin(userId === groupInfo.creatorId);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }, [])
  );

  const handleLeaveGroup = async () => {
    try {
      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;

      Alert.alert(
        "Confirmation",
        "Are you sure you want to leave this group?",
        [
          {
            text: "No",
            onPress: () => console.log("No pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              sendLeftRequest(userId);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5
          name="arrow-left"
          size={20}
          style={styles.back}
          onPress={() => {
            // navigation.goBack();
            navigation.navigate("CommonScreen");
          }}
        />
        <View style={styles.groupInfo}>
          <FontAwesome5
            name="users"
            size={100}
            style={[
              // styles.groupIcon,
              { color: colorTray[groupIndex % colorTray.length] },
            ]}
          />
          {/* <Text style={styles.groupName}>{groupInfo.name}</Text> */}
        </View>
        <FontAwesome5 name="ellipsis-v" size={20} style={styles.listMenu} />
      </View>
      <View style={styles.buttonsRow}>
        {isUserAdmin ? (
          <TouchableOpacity style={styles.buttonAdd} onPress={handleAddMember}>
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.buttonAdd, { backgroundColor: "gray" }]}
            disabled={true}
          >
            <FontAwesome5
              name="plus"
              size={20}
              color="#fff"
              style={[styles.icon, { backgroundColor: "gray" }]}
            />
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity style={styles.buttonDlt} onPress={handleDeleteGroup}>
          <FontAwesome5
            name="trash-alt"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Delete Group</Text>
        </TouchableOpacity> */}

        {isUserAdmin ? (
          <TouchableOpacity
            style={styles.buttonDlt}
            onPress={handleDeleteGroup}
          >
            <FontAwesome5
              name="trash-alt"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Delete Group</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonDlt} onPress={handleLeaveGroup}>
            <FontAwesome5
              name="sign-out-alt"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Leave Group</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Group Details</Text>
        <Text style={styles.infoText}>Group Name: {groupInfo.name}</Text>

        <Text style={styles.infoText}>
          Description: {groupInfo.description ? groupInfo.description : "N/A"}
        </Text>
        {/* <Text style={styles.infoText}>Type: {groupInfo.type}</Text> */}
        <Text style={styles.infoText}>
          Created:{" "}
          {groupInfo.createdAt ? groupInfo.createdAt.split("T")[0] : "N/A"}
        </Text>

        {isUserAdmin ? (
          <>
            <View style={styles.testIdContainer}>
              <Text style={[styles.testIdText]}>{groupInfo.GroupShareId}</Text>
              <TouchableOpacity
                style={styles.copyIcon}
                onPress={() => {
                  startScaleAnimation();
                  copyToClipboard();
                }}
              >
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                  <FontAwesome5
                    name="copy"
                    size={20}
                    color={Color.primaryColor}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={["#FF9800", "#FF5722"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                onPress={handleShareGroupCode}
                style={[styles.button, styles.buttonProp]}
              >
                <Ionicons name="person-add" size={24} color="white" />
                <Text style={styles.buttonText}>Invite</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        ) : (
          <>
            <View style={styles.count}>
              <MaterialCommunityIcons name="lightbulb-on" style={styles.bulb} />
              <Text>Invite Code is Only Visible to Admin</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.memberContainer}>
        <Text style={styles.memberTitle}>Group Members</Text>

        <FlatList
          data={[adminMember, ...filteredMembers]}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderMemberItem}
          contentContainerStyle={styles.memberList}
        />
      </View>

      <Modal
        visible={showAddMemberModel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddMemberModel(false)}
      >
        <View style={styles.modalContainer}>
          <AddMemberModel groupId={groupId} onClose={handleModelClose} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  count: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    backgroundColor: Color.lighYellow,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 10,
    gap: 10,
    borderColor: Color.primaryColor,
    borderWidth: 0.5,
    borderRadius: 30,
    marginVertical: 20,
  },
  bulb: {
    fontSize: 24,
    color: Color.yellow,
  },
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
    width: "50%",
    alignSelf: "center",
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
  testIdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Color.secoundaryBtnColor,
    marginVertical: 20,
    width: "50%",
    alignSelf: "center",
    // gap: 20,
  },
  testIdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Color.primaryColor,
    marginRight: 20,
    alignSelf: "center",
    // left: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  icon: {
    alignSelf: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
  },
  buttonAdd: {
    backgroundColor: Color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignContent: "center",
  },
  buttonDlt: {
    backgroundColor: Color.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  memberUsername: {
    fontSize: 12,
  },
  memberProfileIcon: {
    fontSize: 40,
    marginRight: 10,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Color.colorWhite,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  back: {},
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Color.secoundaryBtnColor,
  },
  groupIcon: {},
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listMenu: {
    color: Color.colorWhite,
  },
  infoContainer: {
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Color.primaryColor,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: Color.colorBlack,
  },
  memberContainer: {
    marginVertical: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Color.colorWhite,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Color.primaryColor,
  },
  memberList: {
    marginTop: 10,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memberProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    marginRight: 5,
  },
  adminIcon: {
    marginLeft: "auto",
    padding: 2,
    paddingHorizontal: 20,
    alignSelf: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: Color.primaryColor,
  },
  removeIcon: {
    marginLeft: "auto",
    padding: 2,
    paddingHorizontal: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  removeText: { fontWeight: "bold", color: Color.red },
});

export default GroupDetailPage;
