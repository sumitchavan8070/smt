import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import InputBox from "../../Components/Forms/InputBox";
import { Color, FontSize } from "../../GlobalStyles";
import PrimaryButton from "../../Components/Forms/PrimaryButton";
import SecoundaryButton from "../../Components/Forms/SecoundaryButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/authContext";

const Register = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);

  //Setting Getter and Setter to Get Input
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // We will Get Values and SetValues
  const [loading, setLoading] = useState(false);

  //Function
  //btn
  const onSubmitRegisterBtn = async () => {
    try {
      setLoading(true);
      if (!name || !username || !email || !password) {
        Alert.alert("All Fileds are Required");
        setLoading(false);

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
      setLoading(false);

      let fcmToken = await AsyncStorage.getItem("fcm_token");

      const { data } = await axios.post("/register", {
        name,
        username,
        email,
        password,
        fcmToken,
      });

      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      alert(data && data.message);
      navigation.navigate("Login");
      console.log("Register Data==> ", { name, username, email, password });
    } catch (error) {
      setLoading(false);
      // console.log(JSON.stringify(error.response));
      alert(error.response.data.message);
      console.log(error);
    }
  };

  const onSubmitExistingUserBtn = () => {
    navigation.navigate("Login");
    console.log("Naviagted to Login Page");
  };

  return (
    <View style={styles.registerScreen}>
      <Text style={styles.register}>Register</Text>
      <InputBox
        inputPlaceholderText={"Enter full name here"}
        inputLabel={"Full Name"}
        value={name}
        setValue={setName}
      />
      <InputBox
        inputPlaceholderText={"Enter username here"}
        inputLabel={"Username"}
        value={username}
        setValue={(value) =>
          setUsername(
            value.toLowerCase().trim().replace(/\s+/g, "").replace(/['"]/g, "") // Replace single and double quotes with an empty string
          )
        }
      />
      <InputBox
        inputPlaceholderText={"Enter email here"}
        inputLabel={"Email"}
        keyboardType="email-address"
        value={email}
        setValue={setEmail}
      />
      <InputBox
        inputPlaceholderText={"Enter password"}
        inputLabel={"Password"}
        secureTextEntry={true}
        value={password}
        setValue={setPassword}
      />

      <PrimaryButton
        buttonTitle="Register"
        loading={loading}
        handleOnSubmit={onSubmitRegisterBtn}
      />

      <SecoundaryButton
        buttonTitle="Already have an account ?"
        secoundBtnMarginTop={600}
        handleOnSubmit={onSubmitExistingUserBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  register: {
    left: "10%",
    fontSize: FontSize.size_5xl,
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.primaryColor,
    textAlign: "left",
    marginVertical: 20,
  },
  registerScreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default Register;
