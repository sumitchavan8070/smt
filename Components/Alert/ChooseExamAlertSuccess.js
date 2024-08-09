import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/ins.json";
import { Color } from "../../GlobalStyles";

import { SimpleLineIcons } from "@expo/vector-icons";

const ChooseExamAlertSuccess = ({
  isVisible,
  // onInstructions,
  onSkipIntructions,
  message,
  onClose,
}) => {
  if (!isVisible) return null;

  const [instructionsPageVisible, setIsInstructionPageVisible] =
    useState(false);

  const onInstructions = () => {
    setIsInstructionPageVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={onClose}>
          <SimpleLineIcons name="close" style={styles.closeIcon} />
        </TouchableOpacity>

        {/* <LottieView
          source={loadingAnimation} // Replace with your animation JSON file
          autoPlay
          loop={true}
          style={styles.animation}
        />
        <Text style={styles.message}>
          {message}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onInstructions} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>View Instructions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSkipIntructions}
            style={styles.skipButton}
          >
            <Text style={styles.closeButtonText}>Start Test</Text>
          </TouchableOpacity> */}
        {instructionsPageVisible ? (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontWeight: "bold", marginVertical: 5 }}>
                A. सर्वसामान्य सूचना:
              </Text>
              <Text>
                1. परीक्षेचा एकूण कालावधी : 60 मिनिटे.
                <Text style={{ color: Color.extraRed }}>*</Text>
              </Text>
              <Text>
                2. सर्व प्रश्न वस्तुनिष्ठ प्रकारचे आहेत. प्रत्येक प्रश्नाला चार
                पर्याय दिलेले आहेत त्यापैकी केवळ एक उत्तर बरोबर असेल.
              </Text>
              <Text>3. चुकीच्या उत्तरांसाठी नकारात्मक गुण नाहीत.</Text>
              <Text>4. स्क्रीनवर एकावेळी एक प्रश्न दर्शवला जाईल.</Text>
              <Text>
                5. परीक्षेच्या सुरुवातीला वेळदर्शक (timer) 60 मिनिटे दर्शवेल, जी
                वेळ संपेल तसतशी हळूहळू कमी होत जातील. जेव्हा वेळदर्शक (timer)
                शून्यावर पोहोचेल, परीक्षा स्वतःहून संपेल आणि यंत्रणेद्वारे तुमची
                परीक्षा आपोआप अधीन (सबमिट) होईल.
              </Text>
              <Text>
                6. पुढील प्रश्न पाहण्यासाठी{" "}
                <Text style={{ color: Color.primaryColor, fontWeight: "bold" }}>
                  Next
                </Text>{" "}
                ह्या बटणाचा उपयोग करावा.
              </Text>
              <Text>
                7. मागील प्रश्न पाहण्यासाठी{" "}
                <Text style={{ color: Color.yellow, fontWeight: "bold" }}>
                  Previous
                </Text>{" "}
                ह्या बटणाचा उपयोग करावा.
              </Text>
              <Text>
                8. परीक्षा समाप्त करण्यासाठी{" "}
                <Text style={{ color: Color.extraRed, fontWeight: "bold" }}>
                  Submit
                </Text>{" "}
                ह्या बटणाचा उपयोग करावा.
              </Text>
              <Text style={{ fontWeight: "bold", marginVertical: 5 }}>
                B. इतर सूचना:
              </Text>
              <Text>
                1. प्रश्न बदलण्यासाठी आपण स्वाइप उजवीकडे आणि डावीकडे चा वापर करू
                शकता.
              </Text>
              <Text>
                2. उजवीकडे प्रश्न क्रमांकाचा रकाना आहे. ऍक्टिव्ह म्हणजेच चालू
                प्रश्न हा{" "}
                <Text style={{ color: Color.darkGreen, fontWeight: "bold" }}>
                  हिरव्या
                </Text>{" "}
                रंगाचा दिसेल.
              </Text>
              <Text>
                3. उजवीकडे प्रश्न क्रमांकावर क्लिक करून प्रश्न बदल करता येईल.
              </Text>
              <Text>
                4. डावीकडे प्रश्न व पर्याय दिसतील , उत्तर दिलेला पर्याय हा{" "}
                <Text style={{ color: Color.green, fontWeight: "bold" }}>
                  हिरव्या
                </Text>{" "}
                रंगाचा दिसेल व त्यासंबंधीत उजवी कडील प्रश्न क्रमांक{" "}
                <Text style={{ color: Color.primaryColor, fontWeight: "bold" }}>
                  जांभळा
                </Text>{" "}
                रंगाचा दिसेल
              </Text>
            </ScrollView>
            <View
              style={[
                styles.buttonContainer,
                { marginTop: 20, marginBottom: 5 },
              ]}
            >
              <TouchableOpacity
                onPress={onSkipIntructions}
                style={styles.skipButton}
              >
                <Text style={styles.closeButtonText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <LottieView
              source={loadingAnimation} // Replace with your animation JSON file
              autoPlay
              loop={true}
              style={styles.animation}
            />
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onInstructions}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>View Instructions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSkipIntructions}
                style={styles.skipButton}
              >
                <Text style={styles.closeButtonText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    fontSize: 30,
    color: Color.primaryColor,
    left: "50%",
    marginRight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
  },
  animation: {
    width: "80%",
    height: 300,
    alignSelf: "center",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensure the alert card is on top
  },
  card: {
    backgroundColor: Color.colorWhite,
    width: "95%",
    height: "80%",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Add elevation for Android shadow
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: "10%",
    color: Color.primaryColor,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: Color.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  skipButton: {
    backgroundColor: Color.darkGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChooseExamAlertSuccess;
