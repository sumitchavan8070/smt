import { View, Text, StyleSheet, Alert, Keyboard } from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import InputBox from "../../Components/Forms/InputBox";
import { Color, FontSize } from "../../GlobalStyles";
import PrimaryButton from "../../Components/Forms/PrimaryButton";
import SecoundaryButton from "../../Components/Forms/SecoundaryButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingAnimation from "../../Components/Loader/loader";
import { requestUserPermission } from "../../utils/notificationService";

const Login = ({ navigation }) => {
  //global state
  const [state, setState] = useContext(AuthContext);

  //Setting Getter and Setter to Get Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // We will Get Values and SetValues
  const [loading, setLoading] = useState(false);

  const onSubmitLoginBtn = async () => {
    Keyboard.dismiss;

    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("All Fileds are Required");
        setLoading(false);
        return;
      }
      requestUserPermission();

      Keyboard.dismiss;
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      setState(data);
      //Setting Local Storage
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      alert(data && data.message);

      setLoading(false);

      navigation.navigate("Home");
      console.log("Login Data==> ", { email, password });
      // console.log("Information Entered By User : ", { email, password });
    } catch (error) {
      alert(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  //Naviagte to Register Page
  const onSubmitNewUserBtn = () => {
    console.log("Naviagted to Register Page");
    navigation.navigate("Register");
  };

  //temp function to check local storage data
  const getLcoalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
    console.log("Local Storage ==> ", data);
  };
  getLcoalStorageData();

  return (
    <View style={styles.loginScreen}>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <Text style={styles.login}>Login</Text>

      <InputBox
        inputPlaceholderText={"Enter email "}
        inputLabel={"Email"}
        keyboardType="email-address"
        // propTop={294}
        value={email}
        setValue={setEmail}
      />
      <InputBox
        inputPlaceholderText={"Enter password"}
        inputLabel={"Password"}
        secureTextEntry={true}
        // propTop={374}
        value={password}
        setValue={setPassword}
      />
      {/* <Text style={{ marginTop: 400 }}>
        {JSON.stringify({ email, password }, null, 4)}
      </Text> */}

      <PrimaryButton
        buttonTitle="Login"
        loading={loading}
        handleOnSubmit={onSubmitLoginBtn}
      />

      <SecoundaryButton
        buttonTitle="New User ? Register here."
        handleOnSubmit={onSubmitNewUserBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  login: {
    left: "10%",
    fontSize: FontSize.size_5xl,
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.primaryColor,
    textAlign: "left",
    marginVertical: 20,
  },
  loginScreen: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default Login;
