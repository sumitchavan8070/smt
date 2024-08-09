import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Assuming you're using Expo
import InputBox from "../Forms/InputBox";
import { Color } from "../../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CreateGroupModel = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(""); // New state for group name
  const [description, setDescription] = useState(null);
  const navigation = useNavigation();

  const handleSearch = async () => {
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let username = loginData.user.username;

    if (searchQuery.trim() !== "") {
      if (searchQuery.toLowerCase() === username.toLowerCase()) {
        alert("You cannot add your own username");
        setSearchQuery(""); // Clear search query
        return;
      }
      await axios
        .get(`/groups/member/search?query=${searchQuery}`)
        .then((response) => {
          setSearchResults(response.data);
          // console.log("Member Users" + JSON.stringify(response.data));
        })
        .catch((error) => {
          // console.error("Error fetchingonClose search results:", error);
          // Alert.alert(error);
          alert(error.response.data.message);

          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a group description.");
      return;
    }

    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let creatorId = loginData.user._id;
    let username = loginData.user.username;

    const memberArray = selectedUsers.map((user) => ({
      id: user._id,
      name: user.name, // Assuming you have a 'name' field in the selectedUsers data
      username: user.username,
    }));

    memberArray.push({
      id: loginData.user._id,
      name: loginData.user.name,
      username: loginData.user.username,
    }); // Replace creatorName with the actual name

    // console.log("Member Array :" + JSON.stringify(memberArray));

    try {
      const response = await axios.post("/groups/group/create", {
        name: groupName,
        description: description, // Assuming description is also a state
        creatorId: creatorId,
        members: memberArray, // Use IDs and names of selected users
      });
      navigateToCommon();
      handleClear();

      Alert.alert("Success", "Group created successfully.");
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group. Please try again.");
    }
  };

  const navigateToCommon = async () => {
    navigation.navigate("CommonScreen");
    onClose();
  };
  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);

    if (isSelected) {
      const updatedUsers = selectedUsers.filter((u) => u._id !== user._id);
      setSelectedUsers(updatedUsers);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleProceed = () => {
    if (selectedUsers.length === 0 || groupName.trim() === "") {
      alert("Please choose at least one member and enter a group name.");
      return;
    }
    handleCreateGroup();
  };

  const handleClear = () => {
    setSearchQuery(""); // Clear search query
    setSearchResults([]); // Clear search results
    setSelectedUsers([]); // Clear selected users
    setGroupName(""); // Clear group name
  };

  return (
    <View style={styles.container}>
      <View style={styles.formItem}>
        <Text style={styles.formHeading}> Create Group</Text>
        <TextInput
          style={styles.groupInput}
          placeholder="Enter Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TextInput
          style={styles.groupInput}
          placeholder="Add Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.groupInput}
            placeholder="Search by username or email"
            value={searchQuery}
            // onChangeText={setSearchQuery}
            onChangeText={(value) =>
              setSearchQuery(value.toLowerCase().replace(/['"\s]/g, ""))
            }
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.linkText}>Search</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserSelect(item)}
            >
              <View style={styles.checkbox}>
                {selectedUsers.some((u) => u._id === item._id) ? (
                  <FontAwesome5 name="check-circle" size={24} color="#6949ff" />
                ) : (
                  <FontAwesome5 name="circle" size={24} color="#ccc" />
                )}
              </View>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
          style={styles.flatList}
        />
      </View>

      <Text style={styles.selectedUsersHeader}>Choosen Members:</Text>
      <Text style={styles.selectedUsersList}>
        {selectedUsers.length > 0 ? (
          selectedUsers.map((user, index) => (
            <Text key={user._id}>
              {index > 0 && ", "}
              {user.name}
            </Text>
          ))
        ) : (
          <Text>No users are selected</Text>
        )}
      </Text>

      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>Create Group</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.proceedButton} onPress={handleClear}>
        <Text style={styles.proceedButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Color.primaryColor,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  linkText: {
    color: Color.primaryColor,
    right: 60,
    fontWeight: "bold",
  },
  groupInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: Color.primaryColor,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    width: "100%",
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  checkIcon: {
    color: "#fff",
    fontSize: 16,
  },
  flatList: {
    marginBottom: 20,
    maxHeight: 150, // Set maxHeight or any desired height
  },
  selectedUsersHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: Color.primaryColor,
  },
  selectedUsersList: {
    paddingVertical: 10,
  },
  proceedButton: {
    backgroundColor: "#6949ff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  proceedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreateGroupModel;
