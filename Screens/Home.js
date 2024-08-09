import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import FooterMenu from "../Components/Menus/FooterMenu";
import HeaderMenu from "../Components/Menus/HeaderMenu";
import Banner from "../Components/Banner/Banner";
import ExamCategories from "../Components/Exams/ExamCategories";
import Exam from "../Components/Exams/Exam";
import CategoryComponent from "../Components/CategoryBanner/CategoryComponent";
import MenuContainerComponent from "../Components/MenuContainer/MenuContainerComponent";
import BetaHomePageBanner from "../Components/BetaBanner/BetaHomePageBanner";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import JoinBox from "../Components/JoinBox/JoinBox";
import QuestionPaperSection from "../Components/QuestionPaperSection/QuestionPaperSection";
import socketServices from "../utils/sockertService";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleLinkText = () => {
    navigation.navigate("ViewAll");
  };

  const [username, setUsername] = useState(null);
  const [id, setId] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      try {
        const data = await AsyncStorage.getItem("@auth");
        if (data) {
          const loginData = JSON.parse(data);
          const fetchedUsername = loginData.user.name;

          //Initilized socket
          socketServices.initialzeSocekt(loginData.user._id);

          setUsername(fetchedUsername);
        } else {
          setUsername(null); // Handle case where data is not available
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername(null); // Handle error case
      }
    };

    getUsername();
  }, []); // Empty dependency array to run effect only once

  const [state] = React.useContext(AuthContext);
  //auth condition true false
  const authenticatedUser = state?.user && state?.token;

  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const updateFCMToken = async () => {
      try {
        const token = await AsyncStorage.getItem("fcm_token");
        if (token !== null) {
          setFcmToken(token);
          // Get user ID from state or wherever you store it
          const userId = state?.user._id;

          // Send API request to update FCM token for the user
          const response = await axios.put(`/fcm/${userId}/update`, {
            fcmToken: token,
          });
          console.log("FCM token updated successfully:", response.data);
        }
      } catch (error) {
        console.error("Error updating FCM token:", error);
      }
    };

    updateFCMToken();
  }, []); // Empty dependency array to run only once on mount

  useFocusEffect(
    React.useCallback(() => {
      const updateTokenOnFocus = async () => {
        const token = await AsyncStorage.getItem("fcm_token");
        if (token !== fcmToken) {
          // FCM token changed, update it
          setFcmToken(token);
          const userId = state?.user._id;
          const response = await axios.put(`/fcm/${userId}/update`, {
            fcmToken: token,
          });
          console.log("FCM token updated on focus:", response.data);
        }
      };

      updateTokenOnFocus();

      return () => {
        // Cleanup function (optional)
      };
    }, []) // Dependency array with fcmToken as dependency
  );
  return (
    //Header

    <View style={styles.homescreen}>
      <ScrollView style={styles.scroll}>
        {/* //Header */}
        <HeaderMenu />
        <Banner />
        <JoinBox />

        <BetaHomePageBanner username={username} />

        {/* <View style={styles.catContainer}> */}
        <CategoryComponent
          mainCatName="Exams"
          // linkName="ViewAll"
          // handleLinkText={handleLinkText}
        />
        <Exam />

        <MenuContainerComponent></MenuContainerComponent>
        {/* </View> */}

        <CategoryComponent
          mainCatName="Exam wise Question Papers"
          // linkName="ViewAll"
          handleLinkText={handleLinkText}
        />
        <QuestionPaperSection />

        {/* <Section /> */}
        <View style={styles.bottomSpace} />
      </ScrollView>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Color.colorWhite,
    flexGrow: 1,
  },

  homescreen: {
    flex: 1,
  },
  bottomSpace: {
    paddingVertical: 60,
  },
});

export default HomeScreen;
