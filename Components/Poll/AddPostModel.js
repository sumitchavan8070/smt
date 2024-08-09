import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Color } from "../../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingAnimation from "../Loader/loader";
import PostAlert from "../Alert/PostAlert";

const AddPostModal = ({ onClose, onAddPost }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [imageuriLocal, setImageuriLocal] = useState(null);

  const [loading, setLoading] = useState(false);
  const [imageCloudUrl, setImageCloudUrl] = useState("");
  const [imageCloudPublicId, setImageCloudPublicId] = useState("");

  // const [postSuccessAlert, setPostSuccessAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState("");

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
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
    }
  };

  const handleAddPost = async () => {
    setLoading(true); // Start loading animation
    Keyboard.dismiss();

    if (!image) {
      alert("Please select an image.");
      setLoading(false);

      return;
    }
    if (!description) {
      alert("Please add description.");
      setLoading(false);

      return;
    }
    const uploadedUrl = await uploadFileOnCloudinary(imageuriLocal);
    console.log("loader " + uploadedUrl);
    const data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    let userId = loginData.user._id;

    const postData = {
      imageUrl: uploadedUrl,
      description: description,
      postedBy: userId,
      isSponsored: false,
      approved: false,
    };

    try {
      const response = await axios.post("posts/create-post", postData);
      console.log("Create Post Response: ", response.data);

      setShowAlert(true);
      setAlertMessage(
        "Your post has been submitted successfully and is awaiting review by our team. Thank you!"
      );
      // onClose();
    } catch (error) {
      console.error("Error creating post: ", error);
      Keyboard.dismiss();
      setLoading(false);
      setShowAlert(true); // Show the error alert card
      setAlertMessage("Appreciated Efforts.. But Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setImage(null);
    setDescription("");
    setShowAlert(false);
    onClose();
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

  // Function to handle cancel button click
  const handleCancel = async () => {
    // Make a DELETE request to your backend API endpoint
    // console.log("Public id in delete :" + imageClouldPublicId);
    // await axios
    //   .delete("/delete-image", {
    //     params: { imageId: imageClouldPublicId }, // Pass the image URL to delete
    //   })
    //   .then((response) => {
    //     // Handle success response if needed
    //     console.log("Image deleted successfully");
    //   })
    //   .catch((error) => {
    //     // Handle error response if needed
    //     console.error("Error deleting image:", error);
    //   });

    // Close the modal
    onClose();
  };

  return (
    // <ScrollView style={styles.scroll}>
    // <Modal animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {loading && <LoadingAnimation visible={loading} loop={true} />}

        {showAlert && (
          <PostAlert
            isVisible={showAlert}
            onClose={handleOnClose}
            message={alertMessage}
          />
        )}

        <TouchableOpacity
          style={styles.selectImgBtn}
          onPress={handleImageUpload}
        >
          <Text style={styles.selectImgBtnTxt}>Select Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <TextInput
          placeholder="Add Description..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          style={styles.descriptionInput}
          keyboardType="default"
        />

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.selectImgBtn} onPress={handleAddPost}>
            <Text style={styles.selectImgBtnTxt}>Add Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectImgBtn} onPress={handleCancel}>
            <Text style={styles.selectImgBtnTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {/* <PostAlert
          isVisible={showAlert}
          onClose={() => setShowAlert(false)} // Close the alert card on button press
          message={alertMessage}
        /> */}
      </View>
    </View>
    // {/* </Modal> */}
  );
};

const styles = StyleSheet.create({
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
  imagePreview: {
    width: "100%",
    height: 300,
    marginVertical: 10,
    alignSelf: "center",
    borderColor: Color.primaryColor,
    borderWidth: 1,
    borderRadius: 15,
  },
  descriptionInput: {
    width: "100%",
    height: 100,
    borderColor: Color.primaryColor,
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    marginBottom: 10,
    // zIndex: 99999,
  },
});

export default AddPostModal;
