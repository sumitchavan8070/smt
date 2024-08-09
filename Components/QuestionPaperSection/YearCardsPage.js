 import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const YearCardsPage = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [examYears, setExamYears] = useState([]);

  useEffect(() => {
    fetchExamYears();
  }, []);

  const fetchExamYears = async () => {
    try {
      const response = await axios.get(`/years/${categoryId}`);
      setExamYears(response.data); // Assuming the response has a "data" property with examYears array
      // console.log("===YearData==>" + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching exam years:", error);
    }
  };

  const navigateToQuestionPapers = (yearId) => {
    navigation.navigate("QuestionPapersPage", { categoryId, yearId });
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 10,
    },
    yearCard: {
      width: "48%", // Adjust as needed based on your design
      margin: "1%", // Adjust margin to create space between cards
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 20,
      marginBottom: 10,
    },
    yearText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {examYears.map((year) => (
        <TouchableOpacity
          key={year._id}
          style={styles.yearCard}
          onPress={() => navigateToQuestionPapers(year._id)}
        >
          <Text
            style={styles.yearText}
          >{`${year.QPYear} (${year.questionPaperCount} question papers)`}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default YearCardsPage;
