import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, View, Text, StyleSheet, Button } from "react-native";

const SummaryPage = ({ route }) => {
  const { questionData, selectedOptions } = route.params;

  const navigation = useNavigation(); // Initialize navigation hook

  let correctAnswersCount = 0;
  let incorrectAnswersCount = 0;

  // Iterate through each question's index
  questionData.forEach((question, index) => {
    const selectedOptionKey = selectedOptions[index];
    // console.log("Selected Option Key : " + selectedOptionKey);
    const correctAnswer = question.answer; // Assuming correctAnswer is stored in question data
    // console.log("Selected Answer Key : " + correctAnswer);

    // Check if the selected option key matches the correct answer
    if (selectedOptionKey === correctAnswer) {
      correctAnswersCount++;
    } else {
      incorrectAnswersCount++;
    }
  });

  // Now you have the count of correct answers
  // console.log("Total Correct Answers:", correctAnswersCount);
  // console.log("Total InCorrect Answers:", incorrectAnswersCount);
  let scorePercentage = (correctAnswersCount / questionData.length) * 100;

  // console.log("scorePercentage : ", scorePercentage);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questionData.map((question, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.subtitle}>Options:</Text>
          <View style={styles.optionContainer}>
            {["option1", "option2", "option3", "option4"].map((optionKey) => (
              <Text
                key={optionKey}
                style={[
                  styles.optionText,
                  optionKey === question.answer ? styles.correctOption : null,
                  optionKey === selectedOptions[index]
                    ? styles.selectedOption
                    : null,
                ]}
              >
                {question[optionKey]}
              </Text>
            ))}
          </View>
          <Text style={styles.subtitle}>Correct Answer: {question.answer}</Text>
          {selectedOptions[index] !== undefined ? (
            <Text style={styles.selectedOptionText}>
              Selected Option: {[`${selectedOptions[index]}`]}
            </Text>
          ) : (
            <Text style={styles.unattemptedText}>
              Selected Option: Unattempted Question
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  optionContainer: {
    marginTop: 5,
  },
  optionText: {
    marginBottom: 5,
  },
  correctOption: {
    fontWeight: "bold",
    color: "green",
  },
  selectedOption: {
    // backgroundColor: "yellow",
  },
  selectedOptionText: {
    color: "green",
    marginTop: 5,
    fontWeight: "bold",
  },
  unattemptedText: {
    color: "red",
    marginTop: 5,
  },
});

export default SummaryPage;
