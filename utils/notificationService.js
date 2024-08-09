import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
// import firebase from "react-native-firebase";
// import { firebase } from "@react-native-firebase/messaging";
import { firebase } from "@react-native-firebase/messaging";

export async function requestUserPermission() {
  try {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getFCMToken();
      } else {
        console.log("Permission denied");
      }
    } else {
      const authStatus = await firebase.messaging().requestPermission();
      console.log("authStatus" + authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
        getFCMToken();
      }
    }
  } catch (error) {
    console.log("Error requesting permission:", error);
  }
}

// const getToken = async () => {
//   try {
//     const token = await firebase.messaging().getToken();
//     if (token) return token;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getFCMToken = async () => {
//   try {
//     const authorized = await firebase.messaging().hasPermission();
//     const fcmToken = await getToken();
//     await AsyncStorage.setItem("fcm_token", fcmToken);
//     console.log("fcmTokenvfcmToken1" + fcmToken);

//     if (authorized) return fcmToken;

//     await firebase.messaging().requestPermission();
//     await AsyncStorage.setItem("fcm_token", fcmToken);
//     console.log("fcmTokenvfcmToken" + fcmToken);
//     return fcmToken;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getFCMToken = async () => {
//   try {
//     await firebase.messaging().registerDeviceForRemoteMessages();

//     let fcmToken = await AsyncStorage.getItem("fcm_token");
//     if (!!fcmToken) {
//       console.log("OLD FCM_TOKEN FOUND", fcmToken);
//     } else {
//       const token = await firebase.messaging().getToken();
//       await AsyncStorage.setItem("fcm_token", token);
//       console.log("NEW FCM_TOKEN", token);
//     }
//   } catch (error) {
//     console.log("error during generating token", error);
//   }
// };

const getFCMToken = async () => {
  try {
    if (Platform.OS === "ios") {
      console.log("User is on iOS device");
      return; // Skip getting FCM token for iOS
    }

    await firebase.messaging().registerDeviceForRemoteMessages();

    let fcmToken = await AsyncStorage.getItem("fcm_token");
    if (!!fcmToken) {
      console.log("OLD FCM_TOKEN FOUND", fcmToken);
    } else {
      const token = await firebase.messaging().getToken();
      await AsyncStorage.setItem("fcm_token", token);
      console.log("NEW FCM_TOKEN", token);
    }
  } catch (error) {
    console.log("error during generating token", error);
  }
};
