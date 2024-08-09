import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Color } from "../../GlobalStyles";
import ChooseExamAlertSuccess from "../Alert/ChooseExamAlertSuccess";
import { useNavigation } from "@react-navigation/native";

const PaperCard = ({ data, onPress }) => {
  const { subCatId, yearId, QPYear, subCatName, questions } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(questions, QPYear)}
    >
      {/* <Text>Subcategory ID: {subCatId}</Text>
      <Text>Year ID: {yearId}</Text>
      <Text>subCatName: {subCatName}</Text>
      <Text>QPYear: {QPYear}</Text>
      <Text>Total Questions: {questions.length}</Text> */}
      <Text style={[styles.subCatLabel]}>{subCatName}</Text>
      <Text style={styles.content}>Year : {QPYear}</Text>
      <Text style={styles.content}>Total Questions: {questions.length}</Text>
      <Text style={[styles.attemptNowBtn]}>Attempt Paper</Text>
    </TouchableOpacity>
  );
};

const PaperCardsContainer = ({ papers }) => {
  const navigation = useNavigation();

  const [showAlertTest, setShowAlertTest] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [alertMessageTest, setAlertMessageTest] = useState("");
  const [qpYear, setQpYear] = useState("");

  const handleAttempt = (questions, QPYear) => {
    console.log("Attempt Questions:", questions);
    setShowAlertTest(true);
    setAlertMessageTest("Quick Tips: There are no Tips. Best of luck!");
    setQuestionData(questions);
    // console.log("=========>" + QPYear);
    setQpYear(QPYear);
  };

  const handleOnInstructions = () => {
    navigation.navigate("InstructionPage", {
      questionData,
      testId: "MAPYQ" + qpYear,
    });
  };

  const handleOnSkipIntructions = () => {
    // console.log("Skip is Clicked");
    navigation.navigate("TestPage", {
      questionData,
      testId: "MAPYQ" + qpYear,
    });
  };

  return (
    <>
      {showAlertTest && (
        <ChooseExamAlertSuccess
          isVisible={showAlertTest}
          onInstructions={handleOnInstructions}
          onSkipIntructions={handleOnSkipIntructions}
          message={alertMessageTest}
        />
      )}
      <ScrollView>
        <View style={styles.container}>
          {papers.map((paper, index) => (
            //   console.log("===>" + JSON.stringify(paper.QPYear)),
            <PaperCard key={index} data={paper} onPress={handleAttempt} />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
    // backgroundColor: Color.primaryColor,
  },
  card: {
    width: "45%",
    marginVertical: 10,
    padding: 15,
    // backgroundColor: Color.secoundaryBtnColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.primaryColor,
  },
  subCatLabel: {
    color: Color.primaryColor,
    alignSelf: "flex-start",
    fontWeight: "bold",
    backgroundColor: Color.secoundaryBtnColor,
    padding: 10,
    paddingVertical: 5,
    // width: "70%",
    marginBottom: 10,
  },
  content: {
    marginVertical: 5,
  },
  attemptNowBtn: {
    color: Color.colorWhite,
    alignSelf: "center",
    fontWeight: "bold",
    backgroundColor: Color.primaryColor,
    padding: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginBottom: 5,
    borderRadius: 20,
  },
});

export default PaperCardsContainer;
