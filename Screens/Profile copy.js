import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../Context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterMenu from "../Components/Menus/FooterMenu";
import HeaderMenu from "../Components/Menus/HeaderMenu";
import { Border, Color, FontSize, Padding } from "../GlobalStyles";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo for vector icons
import * as Location from "expo-location"; // Import Expo Location API
import LoadingAnimation from "../Components/Loader/loader";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const UserProfilePage = () => {
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("basic");
  const [basicInfo, setBasicInfo] = useState({
    fullName: state.user.name || "",
    username: state.user.username || "",
    email: state.user.email || "",
    location: state.user.location || "",
    mobileNumber: state.user.mobileNumber || "",
    profilePic: state.user.profilePic,
  });

  const [preparingFor, setPreparingFor] = useState({
    preparing: state.user.preparing || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeBasicInfo = (name, value) => {
    setBasicInfo({ ...basicInfo, [name]: value });
    setErrors({ ...errors, [name]: null });
    setSuccessMessage("");
  };

  const handleUpdate = async () => {
    try {
      // Validate email format
      if (!validateEmail(userData.email)) {
        setErrors({ ...errors, email: "Please enter a valid email address." });
        return;
      }

      // Validate required fields
      if (!userData.fullName || !userData.email) {
        setErrors({
          ...errors,
          fullName: "Full Name is required.",
          email: "Email is required.",
        });
        return;
      }

      setIsLoading(true);
      // Simulate update delay (replace with actual update logic)
      setTimeout(async () => {
        // Your update logic here, using userData
        setIsLoading(false);
        console.log(userData);
        setSuccessMessage("Profile updated successfully.");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating user:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating your profile. Please try again later."
      );
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogout = async () => {
    setState({
      token: "",
      user: null,
    });

    await AsyncStorage.removeItem("@auth");
    const allKeys = await AsyncStorage.getAllKeys();
    // const keysToRemove = allKeys.filter((key) => key.includes("created"));

    await AsyncStorage.multiRemove(allKeys);
    await AsyncStorage.clear();
    alert("Logout Successfully");
  };

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const handleSubscription = () => {
    setSubscriptionActive(true); // Activate the subscription
  };

  const handleBackSubscription = () => {
    setSubscriptionActive(false); // Activate the subscription
  };

  const fetchLocationInfo = async (latitude, longitude) => {
    // if (currentLocation) {
    try {
      const locationInfo = await Location.reverseGeocodeAsync({
        // latitude: currentLocation.latitude,
        // longitude: currentLocation.longitude,
        latitude,
        longitude,
      });

      if (locationInfo && locationInfo.length > 0) {
        const { city, country, postalCode } = locationInfo[0];
        setLocationInfo(`${city}, ${country} ${postalCode}`);
        // handleChange(
        //   "location",
        //   `Latitude: ${latitude}, Longitude: ${longitude}`
        // );

        // console.log("locationInfo" + JSON.stringify(locationInfo));
        handleChangeBasicInfo("location", `${city}, ${country} ${postalCode}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching location info:", error);
    }
    // }
  };

  const handleAddLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location access in settings."
        );
        return;
      }
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // setCurrentLocation({ latitude, longitude });
      fetchLocationInfo(latitude, longitude);
    } catch (error) {
      setLoading(false);
      console.error("Error getting current location:", error);
      Alert.alert(
        "Error",
        "Failed to get current location. Please try again later."
      );
    }
  };

  const handleBasicInfo = async () => {
    // console.log("basicInfo" + JSON.stringify(basicInfo));
    try {
      const { fullName, username, email, location, mobileNumber } = basicInfo;
      const emptyFields = [];

      if (!fullName.trim()) {
        emptyFields.push("Full Name");
      }

      if (!username.trim()) {
        emptyFields.push("Username");
      }

      if (!email.trim()) {
        emptyFields.push("Email");
      }

      if (emptyFields.length > 0) {
        Alert.alert(
          "Error",
          `${emptyFields.join(", ")} ${
            emptyFields.length > 1 ? "are" : "is"
          } required.`
        );
        return;
      }
      if (
        username.match(/^\s/) ||
        username.match(/["']/) ||
        username.match(/[^\w\s]/)
      ) {
        Alert.alert(
          "Invalid Username",
          "Username should not contain spaces, quotes, or special characters."
        );
        setLoading(false);
        return;
      }
      if (/\D/.test(mobileNumber)) {
        Alert.alert("Error", "Mobile Number should contain only numbers.");
        return;
      }
      if (mobileNumber.length !== 10) {
        Alert.alert("Error", "Mobile Number should be 10 digits long.");
        return;
      }
      setLoading(true);
      const userId = state.user._id;
      const updatedInfo = {
        name: fullName,
        username: username,
        email: email,
        location: location,
        mobileNumber: mobileNumber,
      };

      const response = await axios.put(
        `/update-basic-info/${userId}`,
        updatedInfo
      );

      if (response.data.data) {
        // Update the fields with the updated values
        setState({
          ...state,
          user: {
            ...state.user,
            name: fullName,
            username: username,
            email: email,
            location: location,
            mobileNumber: mobileNumber,
          },
        });

        // Clear success message if any
        setSuccessMessage("");
        setLoading(false);

        Alert.alert(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      Alert.alert(error.response.data.message);
    }
  };

  const renderFields = () => {
    switch (activeTab) {
      case "basic":
        return (
          <View>
            <Text style={styles.label}>
              Full Name <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={[styles.input]}
              placeholder="Full Name"
              value={basicInfo.fullName}
              onChangeText={(text) => handleChangeBasicInfo("fullName", text)}
            />
            <Text style={styles.label}>
              Username <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={[styles.input]}
              placeholder="Please enter username"
              defaultValue={basicInfo.username}
              // editable={false}
              onChangeText={(text) => handleChangeBasicInfo("username", text)}
            />
            <Text style={styles.label}>
              Email <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={[styles.input]}
              placeholder="Please enter email"
              defaultValue={basicInfo.email}
              editable={false}
            />
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={[styles.input]}
              placeholder="eg. 9876543210"
              value={basicInfo.mobileNumber ? basicInfo.mobileNumber : ""}
              onChangeText={(text) =>
                handleChangeBasicInfo("mobileNumber", text)
              }
              keyboardType="numeric" // Allow only numeric keyboard
            />
            {/* <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.input]}
              placeholder="Please enter your location"
              value={userData.location ? userData.location : ""}
              onChangeText={(text) => handleChange("location", text)}
            /> */}
            <Text style={styles.label}>Address</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Tap on icon to retrive address"
                value={basicInfo.location ? basicInfo.location : ""}
                onChangeText={(text) => handleChangeBasicInfo("location", text)}
                editable={false}
              />
              <TouchableOpacity
                onPress={handleAddLocation}
                style={styles.locationIcon}
              >
                <Ionicons
                  name="location"
                  size={24}
                  color={Color.primaryColor}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleBasicInfo}
              style={styles.proccedIcon}
            >
              <Text style={styles.proccedText}>Save</Text>
            </TouchableOpacity>
            <View style={styles.bottomSpace} />
          </View>
        );
      // case "education":
      //   return (
      //     <View>
      //       {/* <TextInput
      //         style={[styles.input, errors.education && styles.inputError]}
      //         placeholder="Education"
      //         value={userData.education}
      //         onChangeText={(text) => handleChange("education", text)}
      //       />
      //       {errors.education && (
      //         <Text style={styles.errorText}>{errors.education}</Text>
      //       )} */}

      //       <TextInput
      //         style={[styles.input]}
      //         placeholder="Education"
      //         value={educationalInfo.education}
      //         onChangeText={(text) => handleChange("education", text)}
      //       />
      //     </View>
      //   );

      // case "preparing":
      //   return (
      //     <View>
      //       <TextInput
      //         style={[styles.input, errors.preparingFor && styles.inputError]}
      //         placeholder="Preparing For"
      //         value={userData.preparingFor}
      //         onChangeText={(text) => handleChange("preparingFor", text)}
      //       />
      //       {errors.preparingFor && (
      //         <Text style={styles.errorText}>{errors.preparingFor}</Text>
      //       )}
      //       {/* Other preparing for info fields */}
      //     </View>
      //   );
      // case "setting":
      //   return (
      //     <View>
      //       <View style={styles.settingCard}>
      //         <TouchableOpacity style={styles.btnModify} onPress={handleLogout}>
      //           <Text style={styles.txtModify}>MY SUBSCRIPTION</Text>
      //           <MaterialIcons name="payment" style={styles.subIcon} />
      //         </TouchableOpacity>

      //         <TouchableOpacity style={styles.btnModify} onPress={handleLogout}>
      //           <Text style={styles.txtModify}>LOGOUT</Text>
      //           <AntDesign name="logout" style={styles.logoutIcon} />
      //         </TouchableOpacity>
      //       </View>
      //     </View>
      //   );
      case "setting":
        return (
          <View>
            <View style={styles.settingCard}>
              {subscriptionActive ? (
                <View>
                  <TouchableOpacity onPress={() => handleBackSubscription()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.welcomeText}>Welcome!</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleSubscription}
                  >
                    <Text style={styles.txtModify}>MY SUBSCRIPTION</Text>
                    <MaterialIcons name="payment" style={styles.subIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleLogout}
                  >
                    <Text style={styles.txtModify}>LOGOUT</Text>
                    <AntDesign name="logout" style={styles.logoutIcon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, profilePic: result.uri });
    }
  };

  const defaultProfilePic = "https://wallpapercave.com/wp/wp4172190.jpg";

  return (
    <View style={styles.profileScreen}>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView style={styles.scroll}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              basicInfo.profilePic
                ? { uri: basicInfo.profilePic }
                : { uri: defaultProfilePic }
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>

        {/* <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSolve}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <Text style={styles.txtSolve}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnModify} onPress={handleLogout}>
            <Text style={styles.txtModify}>Logout</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.infoContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "basic" && styles.activeTab]}
              onPress={() => setActiveTab("basic")}
            >
              <AntDesign name="user" size={24} color="white" />
              <Text style={styles.tabText}>Basic Info</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "education" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("education")}
            >
              <Text style={styles.tabText}>Educational Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "preparing" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("preparing")}
            >
              <Text style={styles.tabText}>Preparing For</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.tab, activeTab === "setting" && styles.activeTab]}
              onPress={() => setActiveTab("setting")}
            >
              <AntDesign name="setting" size={24} color="white" />

              <Text style={styles.tabText}>Setting</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <ScrollView style={styles.fieldsContainer}>
            {renderFields()}
          </ScrollView>
        </View>

        {/* Success/Error Messages */}
        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}
        {isLoading ? <ActivityIndicator size="small" color="#000" /> : null}
      </ScrollView>

      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  logoutIcon: {
    fontSize: 18,
    color: Color.primaryColor,
  },
  subIcon: {
    fontSize: 24,
    color: Color.primaryColor,
  },
  settingCard: {
    width: "90%",
    height: 300,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: Color.colorWhite,
    padding: 20,
  },
  star: { color: Color.extraRed },
  proccedIcon: {
    backgroundColor: Color.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginVertical: 50,
  },
  proccedText: {
    color: Color.colorWhite,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    position: "absolute",
    right: 20,
    transform: [{ translateY: -10 }],
  },
  bottomSpace: {
    paddingVertical: 60,
  },
  label: {
    left: 5,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 12,
    color: Color.primaryColor,
  },
  infoContainer: {
    marginVertical: 15,
    backgroundColor: Color.secoundaryBtnColor,
    padding: 20,
    borderRadius: 10,
  },
  profilePic: {
    width: 150,
    paddingVertical: 20,
    height: 150,
    borderRadius: 75,
    // marginBottom: 20,
    alignSelf: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  btnSolve: {
    backgroundColor: Color.primaryColor,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.primaryColor,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: 13,
  },
  btnModify: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.secoundaryBtnColor,
    borderStyle: "solid",
    borderColor: Color.primaryColor,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: Padding.p_2xs,
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
    gap: 40,
  },

  txtModify: {
    fontSize: FontSize.size_xs,
    // textTransform: "capitalize",
    fontWeight: "bold",
    // fontFamily: FontFamily.interBold,
    color: Color.primaryColor,
    textAlign: "center",
  },
  txtSolve: {
    fontSize: FontSize.size_xs,
    textTransform: "capitalize",
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.colorWhite,
    textAlign: "center",
  },

  scroll: {
    padding: 20,
  },
  profileScreen: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    // justifyContent: "space-between",
    gap: 30,
  },
  tab: {
    flexDirection: "row",
    gap: 10,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Color.green,
  },
  activeTab: {
    flexDirection: "row",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: Color.primaryColor,
  },
  tabText: {
    color: Color.colorWhite,
  },
  fieldsContainer: {
    marginBottom: 20,
    // backgroundColor: Color.colorGray,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 0.2,
    borderColor: Color.primaryColor,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "red",
  },

  successMessage: {
    color: "green",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default UserProfilePage;
