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
  Linking,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import paymentImage from "../assets/card.png"; // Import your local image
import contactImage from "../assets/contact.png"; // Import your local image
import aboutImage from "../assets/teamwork.png"; // Import your local image
import logoutImage from "../assets/logout.png"; // Import your local image

import { LinearGradient } from "expo-linear-gradient";
import Subscription from "../Components/Subscription/Subscription";
import CloudinaryProfilePic from "../Components/Profile/CloudinaryProfilePic";
import { Entypo } from "@expo/vector-icons";

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

  const [isSubscriber, setIsSubscriber] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("3Months"); // Initially set to the 3 Months tab
  const [contactActive, setContactActive] = useState(false);
  const [aboutActive, setAboutActive] = useState(false);

  const handleSubscriptionBtn = () => {
    setSubscriptionActive(true); // Activate the subscription
  };

  const handleContactUs = () => {
    setContactActive(true);
    // console.log("Contact us clicked");
  };

  const handleAboutUs = () => {
    setAboutActive(true);
  };

  const handleBackContact = () => {
    setContactActive(false);
  };
  const handleBackAbout = () => {
    setAboutActive(false);
  };

  const handleBackSubscription = () => {
    setSubscriptionActive(false); // Activate the subscription
  };
  const handleSubscription = (months) => {
    const currentDate = new Date();
    let endDate = new Date();

    if (months === 3) {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (months === 6) {
      endDate.setMonth(endDate.getMonth() + 6);
    }

    setSubscriptionEndDate(endDate);

    // Your logic to send subscription data to backend and update isSubscribed
    setIsSubscriber(true);
  };

  const handlePayment = () => {
    // Simulate payment success
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (activeTab === "3Months" ? 3 : 6)); // Set subscription duration
    setIsSubscriber(true);
    setSubscriptionEndDate(endDate);

    // Send payment data to backend (simulated)
    const paymentData = {
      isSubscriber: true,
      subscriptionEndDate: endDate,
    };
    // Simulated API call or logic to handle payment response
    console.log("Payment success:", paymentData);
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

  // const handleBuySubscription = (tier) => {
  //   // Handle logic for buying subscription
  //   console.log(`Buying ${tier} subscription`);
  // };

  const aboutText =
    `Welcome to MeAdhikari,` +
    "\n" +
    `Your ultimate destination for previous year question papers and exam preparation. We are here to provide you all previous year question papers and comprehensive exam preparation resources, making your journey towards success smoother and more effective. ` +
    "\n" +
    `\n` +
    `At MeAdhikari, our mission is to empower students and professionals by giving them access to extensive collections of previous year question papers and top-notch exam preparation resources. We understand the importance of practicing with real exam questions, and we are committed to helping you excel in your exams.`;
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

            <Text style={styles.label}>Address</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { marginBottom: 40 }]}
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
            {/* 
            <TouchableOpacity
              onPress={handleBasicInfo}
              style={styles.proccedIcon}
            >
              <Text style={styles.proccedText}>Save</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={handleBasicInfo}
              style={styles.proccedIcon}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, styles.proccedIcon]}
              />
              <Text style={styles.proccedText}>Update Profile</Text>
            </TouchableOpacity>
            <View style={styles.bottomSpace} />
          </View>
        );

      case "setting":
        return (
          <View>
            {/* <View style={styles.settingCard}>
              {subscriptionActive ? (
                <View>
                  <TouchableOpacity onPress={() => handleBackSubscription()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>

                  <Subscription></Subscription>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleSubscriptionBtn}
                  >
                    <Text style={styles.txtModify}>MY SUBSCRIPTION</Text>
                    <Image source={paymentImage} style={styles.subIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleContactUs}
                  >
                    <Text style={styles.txtModify}>Contact Us</Text>
                    <Image source={contactImage} style={styles.contactIcon} />
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
            </View> */}

            <View style={styles.settingCard}>
              {subscriptionActive || contactActive || aboutActive ? (
                <View>
                  {contactActive ? (
                    <>
                      <TouchableOpacity onPress={() => handleBackContact()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                      </TouchableOpacity>

                      {/* <Text>Contact Us Content</Text> */}
                      <View>
                        <Image
                          source={aboutImage}
                          style={{
                            width: 100,
                            height: 100,
                            alignSelf: "center",
                            marginVertical: 20,
                          }}
                        />
                        <Text style={styles.contactHeading}>Contact us</Text>

                        {/* <View
                          style={{
                            marginVertical: 20,
                            flexDirection: "row",
                            gap: 10,
                            alignSelf: "center",
                          }}
                        >
                          <Entypo name="email" size={18} color="black" />
                          <Text
                            style={{
                              fontSize: 16,
                            }}
                          >
                            shubhamdchavan1111@gmail.com
                          </Text>
                        </View> */}
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              "mailto:shubhamdchavan1111@gmail.com"
                            )
                          }
                          // onPress={() =>
                          //   Linking.openURL(
                          //     "mailto:shubhamdchavan1111@gmail.com?subject=Subject&body=Body"
                          //   )
                          // }
                        >
                          <View
                            style={{
                              marginVertical: 20,
                              flexDirection: "row",
                              gap: 10,
                              alignSelf: "center",
                            }}
                          >
                            <Entypo name="email" size={18} color="black" />
                            <Text
                              style={{
                                fontSize: 16,
                              }}
                            >
                              shubhamdchavan1111@gmail.com
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <Text
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                            textAlign: "center",
                            fontSize: 12,
                            color: Color.darkGreen,
                          }}
                        >
                          Have questions or need assistance? Reach out to our
                          dedicated support team for prompt and reliable
                          assistance
                        </Text>
                      </View>
                    </>
                  ) : aboutActive ? (
                    <>
                      <TouchableOpacity onPress={() => handleBackAbout()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                      </TouchableOpacity>

                      {/* <Text>About Us Content</Text> */}
                      <View>
                        <Text style={styles.contactHeading}>About Us</Text>
                        <Text
                          style={{ marginBottom: 10, justifyContent: "center" }}
                        >
                          {aboutText}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight: "bold" }}>
                          What We Offer
                        </Text>
                        <View
                          style={{ gap: 5, marginTop: 10, marginBottom: 10 }}
                        >
                          <Text>
                            - Extensive collection of Previous Year Question
                            Papers for various exams
                          </Text>
                          <Text>
                            - Detailed analysis and performance tracking
                          </Text>
                          <Text>
                            - Real-time exam simulations for realistic practice*
                          </Text>
                          <Text>
                            - Create and share own test papers with friends and
                            groups
                          </Text>
                        </View>
                        <Text style={{ fontWeight: "bold" }}>
                          Why Choose Us
                        </Text>
                        <View style={{ gap: 5, marginTop: 10 }}>
                          <Text>- Comprehensive coverage of exam syllabi</Text>
                          <Text>
                            - User-friendly interface for seamless navigation
                          </Text>
                          <Text>
                            - Collaborative groups to share tests and study
                            resources
                          </Text>
                          <Text>
                            - Dedicated support for all your exam-related
                            queries
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => handleBackSubscription()}
                      >
                        <Ionicons name="arrow-back" size={24} color="black" />
                      </TouchableOpacity>

                      <Subscription />
                    </>
                  )}
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleSubscriptionBtn}
                  >
                    <Text style={styles.txtModify}>MY SUBSCRIPTION</Text>
                    <Image source={paymentImage} style={styles.subIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleContactUs}
                  >
                    <Text style={styles.txtModify}>Contact Us</Text>
                    <Image source={contactImage} style={styles.contactIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleAboutUs}
                  >
                    <Text style={styles.txtModify}>About Us</Text>
                    <Image source={aboutImage} style={styles.contactIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnModify}
                    onPress={handleLogout}
                  >
                    <Text style={styles.txtModify}>LOGOUT</Text>
                    {/* <AntDesign name="logout" style={styles.logoutIcon} /> */}
                    <Image source={logoutImage} style={styles.logoutIcon} />
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

  const [imageuriLocal, setImageuriLocal] = useState(null);
  const [image, setImage] = useState(null);
  const [imageCloudUrl, setImageCloudUrl] = useState("");
  const [imageCloudPublicId, setImageCloudPublicId] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      setImage(result.assets[0].uri);
      const imageUri = result.assets[0];
      console.log(imageUri);
      let newFile = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".")[1]}`,
        name: `test.${result.assets[0].uri.split(".")[1]}`,
      };
      setImageuriLocal(newFile);
      // const imgData = await uploadFileOnCloudinary(newFile);

      const uploadedUrl = await uploadFileOnCloudinary(imageuriLocal);
      // console.log("loader " + uploadedUrl);

      if (!uploadedUrl) {
        // Show an alert if uploadedUrl is undefined
        setLoading(false);

        Alert.alert(
          "Error",
          "Failed to upload profile picture. Please try again."
        );
        return;
      }

      try {
        const response = await axios.put(`/profile-pic/${state.user._id}`, {
          profilePic: uploadedUrl, // Assuming profilePic is the image data or URL
        });

        // console.log("Profile picture update response:", response.data);

        // Assuming the backend returns the updated user data with profilePic field
        if (response.data.user && response.data.user.profilePic) {
          setProfilePic(response.data.user.profilePic);

          setState({
            ...state,
            user: {
              ...state.user,
              profilePic: response.data.user.profilePic,
            },
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const uploadFileOnCloudinary = async (img) => {
    // setLoading(true); // Start loading animation

    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "meadhikari");
    data.append("cloud_name", "sdchavan");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/sdchavan/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await response.json();

      setImageCloudUrl(result.url);
      setImageCloudPublicId(result.public_id);
      const pubId = await result.public_id;
      // console.log("cloud url :" + url);
      return pubId;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };
  const [defaultProfilePic, setDefaultProfilePic] = useState(
    state.user.profilePic
  );

  useFocusEffect(
    React.useCallback(() => {
      setDefaultProfilePic(state.user.profilePic);
    }, [state.user.profilePic])
  );

  return (
    <View style={styles.profileScreen}>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView style={styles.scroll}>
        <TouchableOpacity onPress={pickImage}>
          {defaultProfilePic.includes("http") ? (
            <Image
              source={{ uri: defaultProfilePic }}
              style={styles.profilePic}
            />
          ) : (
            <CloudinaryProfilePic
              publicId={defaultProfilePic}
              style={styles.profilePic}
            />
          )}
        </TouchableOpacity>

        <Subscription></Subscription>

        <View style={styles.infoContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "basic" && styles.activeTab]}
              onPress={() => setActiveTab("basic")}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, styles.tab]}
              />
              <AntDesign name="user" size={24} color="white" />
              <Text style={styles.tabText}>Basic Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "setting" && styles.activeTab]}
              onPress={() => setActiveTab("setting")}
            >
              <LinearGradient
                colors={["#2196F3", "#1976D2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, styles.tab]}
              />
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
  contactHeading: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: Color.primaryColor,
    marginBottom: 10,
  },
  contactIcon: {
    width: 25,
    height: 25,
  },
  logoutIcon: {
    width: 25,
    height: 25,
  },
  subIcon: {
    width: 30,
    height: 25,
  },
  settingCard: {
    width: "100%",
    // height: 300,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: Color.colorWhite,
    padding: 20,
    marginBottom: 40,
  },
  star: { color: Color.extraRed },
  proccedIcon: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  proccedText: {
    color: Color.colorWhite,
    fontWeight: "bold",
    alignSelf: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    position: "absolute",
    right: 20,
    transform: [{ translateY: -20 }],
  },
  bottomSpace: {
    paddingVertical: 30,
  },
  label: {
    left: 5,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 12,
    color: Color.primaryColor,
  },
  infoContainer: {
    marginVertical: 30,
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
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    // marginBottom: 20,
  },
  activeTab: {
    backgroundColor: "transparent", // Remove the background color here
  },
  tabText: {
    color: "white",
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
