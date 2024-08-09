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
import { Color } from "../../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingAnimation from "../Loader/loader";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Assuming you're using Expo
// import Icon from ;

import { useNavigation } from "@react-navigation/native";

const AddMemberModel = ({ onClose, groupId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const navigation = useNavigation();

  const handleSearch = async () => {
    // try {
    //   if (searchQuery.trim() !== "") {
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let username = loginData.user.username;
    try {
      if (searchQuery.trim() !== "") {
        if (searchQuery.toLowerCase() === username.toLowerCase()) {
          alert("You cannot add your own username");
          setSearchQuery(""); // Clear search query
          return;
        }
        const response = await axios.get(
          `/groups/member/search?query=${searchQuery}`
        );
        setSearchResults(response.data);
      } else {
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      alert(error.response.data.message);
      setSelectedUsers([]);
      setSearchResults([]);
    }
  };

  const handleAddMember = async () => {
    if (selectedUsers.length === 0) {
      alert("Please choose at least one member");
      return;
    }

    const memberArray = selectedUsers.map((user) => ({
      id: user._id,
      name: user.name,
      username: user.username,
    }));

    try {
      const response = await axios.post("/groups/member/add", {
        groupId: groupId,
        members: memberArray,
      });
      Alert.alert(response.data.message);
      onClose();
    } catch (error) {
      Alert.alert(error.response.data.message);
      // onClose();
    } finally {
      setSelectedUsers([]); // Clear selected users
      setSearchResults([]); // Clear search results
    }
  };

  const handleCancel = async () => {
    onClose();
  };

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);

    if (isSelected) {
      setSelectedUsers([user]); // Replace selected user with the current user
    } else {
      setSelectedUsers([user]); // Select the current user
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {loading && <LoadingAnimation visible={loading} loop={true} />}
        <View style={styles.formItem}>
          <Text style={styles.formHeading}> Add Member</Text>

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
                    <FontAwesome5
                      name="check-circle"
                      size={24}
                      color="#6949ff"
                    />
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
        <Text style={styles.selectedUsersHeader}>Choosen Member:</Text>
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

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.selectImgBtn}
            onPress={handleAddMember}
          >
            <Text style={styles.selectImgBtnTxt}>Add Member</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectImgBtn} onPress={handleCancel}>
            <Text style={styles.selectImgBtnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "10%",
  },
  selectImgBtnTxt: {
    color: Color.colorWhite,
  },
  selectImgBtn: {
    padding: 10,
    paddingHorizontal: "15%",
    backgroundColor: Color.primaryColor,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 20,
    marginTop: "5%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // zIndex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "95%",
  },
});

export default AddMemberModel;
