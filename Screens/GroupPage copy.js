// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Modal,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome 5
// import { MaterialIcons } from "@expo/vector-icons"; // Import FontAwesome 5

// import axios from "axios";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CreateGroupModel from "../Components/Group/CreateGroupModel";
// import { Color } from "../GlobalStyles";
// import { useGlobalRefresh } from "../Context/GlobalRefreshContext";
// import LoadingAnimation from "../Components/Loader/loader";
// import LottieView from "lottie-react-native";
// import loadingAnimation from "../assets/group.json";
// import socketServices from "../utils/sockertService";

// const GroupPage = ({
//   groups,
//   setGroups,
//   loading,
//   setLoading,
//   // currentUser,
//   fetchGroup,
// }) => {
//   // useEffect(() => {
//   //   fetchGroup();
//   // }, []);
//   const [currentUser, setCurrentUser] = useState("");

//   const navigation = useNavigation();

//   // const { userData, setUserData } = useState("");

//   // useEffect(() => {
//   //   fetchGroups();
//   // }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchGroups();
//     }, [])
//   );

//   const getUserId = async () => {
//     const data = await AsyncStorage.getItem("@auth");
//     let loginData = JSON.parse(data);
//     let userId = loginData.user._id;
//     return userId;
//   };

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     const id = getUserId();
//   //     socketServices.emit("join_chat", id);
//   //     socketServices.on("new_chat", (values) => {
//   //       setData((previousMessages) => {
//   //         let cloneArry = JSON.parse(JSON.stringify(previousMessages));
//   //         const index = cloneArry.findIndex((item) => item._id == values._id);
//   //         if (index !== -1) {
//   //           cloneArry.splice(index, 1);
//   //         }
//   //         cloneArry.unshift(values);
//   //         return cloneArry;
//   //       });
//   //     });
//   //     return () => removerListerns();
//   //   }, [])
//   // );

//   // const removerListerns = () => {
//   //   const id = getUserId();
//   //   socketServices.removeListener("new_chat");
//   //   socketServices.emit("leave_chat", id);
//   // };

//   const fetchGroups = async () => {
//     const data = await AsyncStorage.getItem("@auth");
//     let loginData = JSON.parse(data);
//     let userId = loginData.user._id;
//     setCurrentUser(loginData);
//     // setUserData(loginData.user);

//     await axios
//       .get(`/groups/group/user/${userId}`)
//       .then((response) => {
//         setGroups(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching groups:", error);
//         setLoading(false);
//       });
//   };

//   const [groupName, setGroupName] = useState("");
//   const [isCreateGroupModalVisible, setCreateGroupModalVisible] =
//     useState(false);

//   const [refreshing, setRefreshing] = useState(false);

//   const handleJoinGroup = (groupId) => {
//     // Implement join group functionality
//   };

//   // const handleGroupPress = (groupId) => {
//   //   navigation.navigate("GroupChatPage", { groupId });
//   // };

//   const handleCreateGroupPress = () => {
//     setCreateGroupModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setCreateGroupModalVisible(false);
//   };

//   const handleGroupPress = (group, index) => {
//     navigation.navigate("GroupChatPage", {
//       groupId: group._id,
//       groupName: group.name,
//       groupIcon: group.profilePic, // Assuming you have a profilePic property in your group data
//       groupIndex: index,
//       groupMembers: group.members,
//       groupInfo: group,
//       currentUser,
//     });

//     // console.log("group object" + JSON.stringify(group.members[0].username));
//   };

//   const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
//   const [showMenu, setShowMenu] = useState(false);

//   return (
//     <View style={styles.container}>
//       {/* Create Group and Join Group buttons */}
//       {loading && <LoadingAnimation visible={loading} loop={true} />}

//       <TouchableOpacity
//         style={styles.floatingButton}
//         onPress={() => setShowMenu(!showMenu)}
//       >
//         <FontAwesome5 name="plus" size={24} color="white" />
//       </TouchableOpacity>

//       {/* Menu options */}
//       {showMenu && (
//         <View style={styles.menu}>
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={handleCreateGroupPress}
//           >
//             <FontAwesome5 name="plus" size={20} color="black" />
//             <Text style={styles.menuText}>Create Group</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => console.log("Join Group pressed")}
//           >
//             <MaterialIcons name="group-add" size={25} color="black" />
//             <Text style={styles.menuText}>Join Group</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <ScrollView>
//         {loading ? (
//           <ActivityIndicator
//             style={styles.loader}
//             size="large"
//             color="#007bff"
//           />
//         ) : groups.length === 0 ? (
//           <View style={styles.noGroupCard}>
//             <LottieView
//               source={loadingAnimation} // Replace with your animation JSON file
//               autoPlay
//               loop={true}
//               style={styles.animation}
//             />
//             <Text style={styles.noGroupsText}>No Groups Found</Text>
//           </View>
//         ) : (
//           groups.map((group, index) => (
//             <TouchableOpacity
//               key={group._id}
//               style={styles.groupItem}
//               onPress={() => handleGroupPress(group, index)}
//             >
//               <FontAwesome5
//                 name="users"
//                 size={24}
//                 style={[
//                   styles.groupIcon,
//                   { color: colorTray[index % colorTray.length] },
//                 ]}
//               />
//               <View style={styles.groupTextContainer}>
//                 <Text style={styles.groupName}>{group.name}</Text>
//                 <Text style={styles.groupDescription}>
//                   {/* Description:{" "} */}
//                   {/* {group.description ? group.description : "No Description"} */}
//                   {/* {group.description.length > 10
//                     ? group.description.slice(0, 10) + "..."
//                     : group.description} */}
//                   {/* {group.latestMessage} */}
//                   {group.latestMessage && group.latestMessage.length > 15 ? (
//                     <Text style={styles.latestMessage}>
//                       {group.latestMessage.slice(0, 15) + "..."}
//                     </Text>
//                   ) : (
//                     group.latestMessage
//                   )}
//                 </Text>
//               </View>
//               <Text style={styles.memberCount}>
//                 Members: {group.members.length}
//               </Text>
//             </TouchableOpacity>
//           ))
//         )}
//       </ScrollView>

//       {/* Create Group Modal */}
//       <Modal
//         visible={isCreateGroupModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={handleCloseModal}
//       >
//         <View style={styles.modalContainer}>
//           <CreateGroupModel onClose={handleCloseModal} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  FlatList, // Added FlatList import
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateGroupModel from "../Components/Group/CreateGroupModel";
import { Color } from "../GlobalStyles";
import { useGlobalRefresh } from "../Context/GlobalRefreshContext";
import LoadingAnimation from "../Components/Loader/loader";
import LottieView from "lottie-react-native";
import loadingAnimation from "../assets/group.json";
import socketServices from "../utils/sockertService";

const GroupPage = ({ groups, setGroups, loading, setLoading, fetchGroup }) => {
  const [currentUser, setCurrentUser] = useState("");
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState("");
  const [isCreateGroupModalVisible, setCreateGroupModalVisible] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorTray = [Color.primaryColor, Color.green, Color.red, Color.yellow];
  const [showMenu, setShowMenu] = useState(false);

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

    await axios
      .get(`/groups/group/user/${userId}`)
      .then((response) => {
        setGroups(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setLoading(false);
      });
  };

  const handleJoinGroup = (groupId) => {
    // Implement join group functionality
  };

  const handleCreateGroupPress = () => {
    setCreateGroupModalVisible(true);
  };

  const handleCloseModal = () => {
    setCreateGroupModalVisible(false);
  };

  const handleGroupPress = (group, index) => {
    navigation.navigate("GroupChatPage", {
      groupId: group._id,
      groupName: group.name,
      groupIcon: group.profilePic,
      groupIndex: index,
      groupMembers: group.members,
      groupInfo: group,
      currentUser,
    });
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowMenu(!showMenu)}
      >
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleCreateGroupPress}
          >
            <FontAwesome5 name="plus" size={20} color="black" />
            <Text style={styles.menuText}>Create Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log("Join Group pressed")}
          >
            <MaterialIcons name="group-add" size={25} color="black" />
            <Text style={styles.menuText}>Join Group</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={groups}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item._id}
            style={styles.groupItem}
            onPress={() => handleGroupPress(item, index)}
          >
            <FontAwesome5
              name="users"
              size={24}
              style={[
                styles.groupIcon,
                { color: colorTray[index % colorTray.length] },
              ]}
            />
            <View style={styles.groupTextContainer}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDescription}>
                {item.latestMessage &&
                  item.latestMessage.length > 15 &&
                  item.latestMessage.slice(0, 15) + "..."}
              </Text>
            </View>
            <Text style={styles.memberCount}>
              Members: {item.members.length}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />

      <Modal
        visible={isCreateGroupModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <CreateGroupModel onClose={handleCloseModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  noGroupCard: {
    // backgroundColor: Color.primaryColor,
    // flexGrow: 1,
  },
  animation: {
    width: "100%",
    height: "90%",
    alignSelf: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: "10%",
    right: 20,
    backgroundColor: "#6949ff",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    bottom: "20%",
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  menuText: {
    marginLeft: 10,
  },
  container: {
    // flex: 1,
    // padding: 20,
    paddingVertical: 5,
    backgroundColor: Color.colorWhite,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    alignSelf: "center",
    gap: 50,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  groupItem: {
    // backgroundColor: "#f0f0f0",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  groupIcon: {
    marginRight: 20,
  },
  groupTextContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupDescription: {
    fontSize: 14,
    color: "#666",
  },
  memberCount: {
    fontSize: 14,
    color: "#666",
  },
  noGroupsText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default GroupPage;
