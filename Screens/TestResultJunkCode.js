// import { View, Text, Button } from "react-native";
// import React, { useEffect } from "react";
// import { useNavigation, useRoute } from "@react-navigation/native";

// const TestResult = () => {
//   const route = useRoute();
//   const { selectedOptions, questionData } = route.params;
//   const navigation = useNavigation();

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: "Test Result",
//       headerLeft: () => (
//         <Button
//           onPress={() => navigation.navigate("Home")}
//           title="Back"
//           color="#000"
//         />
//       ),
//     });
//   }, [navigation]);

//   let correctAnswersCount = 0;
//   let incorrectAnswersCount = 0;

//   questionData.forEach((question, index) => {
//     const selectedOptionKey = selectedOptions[index];
//     // console.log("Selected Option Key : " + selectedOptionKey);
//     const correctAnswer = question.answer; // Assuming correctAnswer is stored in question data
//     // console.log("Selected Answer Key : " + correctAnswer);

//     if (selectedOptionKey === correctAnswer) {
//       correctAnswersCount++;
//     } else {
//       incorrectAnswersCount++;
//     }
//   });

//   // Now you have the count of correct answers
//   console.log("Total Correct Answers:", correctAnswersCount);
//   console.log("Total InCorrect Answers:", incorrectAnswersCount);

//   return (
//     <View>
//       <Text>TestResult</Text>
//     </View>
//   );
// };

// export default TestResult;

// import React from "react";
// import { ScrollView, View, Text, StyleSheet } from "react-native";

// const TestResult = ({ route }) => {
//   const { questionData, selectedOptions } = route.params;

//   return (
//     <ScrollView style={styles.container}>
//       {questionData.map((question, index) => (
//         <View key={index} style={styles.card}>
//           <Text style={styles.questionText}>{question.question}</Text>
//           <Text>Options:</Text>
//           {["option1", "option2", "option3", "option4"].map((optionKey) => (
//             <Text
//               key={optionKey}
//               style={[
//                 styles.optionText,
//                 optionKey === question.answer ? styles.correctOption : null,
//                 optionKey === selectedOptions[index]
//                   ? styles.selectedOption
//                   : null,
//               ]}
//             >
//               {question[optionKey]}
//             </Text>
//           ))}
//           <Text>Correct Answer: {question.answer}</Text>
//           {/* <Text>Selected Option: {selectedOptions[index]}</Text> */}
//           {selectedOptions[index] !== undefined ? (
//             <Text>
//               Selected Option: {question[`option${selectedOptions[index]}`]}
//             </Text>
//           ) : (
//             <Text>Selected Option: Unattempted Question</Text>
//           )}
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   optionText: {
//     marginBottom: 5,
//   },
//   correctOption: {
//     color: "green",
//   },
//   selectedOption: {
//     backgroundColor: "yellow",
//   },
// });

// export default TestResult;

// ===================================================
// import React from "react";
// import { ScrollView, View, Text, StyleSheet } from "react-native";

// const TestResult = ({ route }) => {
//   const { questionData, selectedOptions } = route.params;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {questionData.map((question, index) => (
//         <View key={index} style={styles.card}>
//           <Text style={styles.questionText}>{question.question}</Text>
//           <Text style={styles.subtitle}>Options:</Text>
//           <View style={styles.optionContaiColor.primaryColorner}>
//             {["option1", "option2", "option3", "option4"].map((optionKey) => (
//               <Text
//                 key={optionKey}
//                 style={[
//                   styles.optionText,
//                   optionKey === question.answer ? styles.correctOption : null,
//                   optionKey === selectedOptions[index]
//                     ? styles.selectedOption
//                     : null,
//                 ]}
//               >
//                 {question[optionKey]}
//               </Text>
//             ))}
//           </View>
//           <Text style={styles.subtitle}>Correct Answer: {question.answer}</Text>
//           {selectedOptions[index] !== undefined ? (
//             <Text style={styles.selectedOptionText}>
//               Selected Option: {question[`option${selectedOptions[index]}`]}
//             </Text>
//           ) : (
//             <Text style={styles.unattemptedText}>
//               Selected Option: Unattempted Question
//             </Text>
//           )}
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 10,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   optionContainer: {
//     marginTop: 5,
//   },
//   optionText: {
//     marginBottom: 5,
//   },
//   correctOption: {
//     color: "green",
//   },
//   selectedOption: {
//     backgroundColor: "yellow",
//   },
//   selectedOptionText: {
//     color: "blue",
//   },
//   unattemptedText: {
//     color: "red",
//   },
// });

// export default TestResult;
// =====================================================================================================================

import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";

const TestResult = ({ route }) => {
  const { questionData, selectedOptions } = route.params;

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
              Selected Option: {question[`option${selectedOptions[index]}`]}
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
    fontSize: 18,
    fontWeight: "bold",
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
    color: "green",
  },
  selectedOption: {
    backgroundColor: "yellow",
  },
  selectedOptionText: {
    color: "blue",
    marginTop: 5,
  },
  unattemptedText: {
    color: "red",
    marginTop: 5,
  },
});

export default TestResult;

//====================================================Pagination Code is Below

// import React, { useState } from "react";
// import { ScrollView, View, Text, StyleSheet, Button } from "react-native";

// const TestResult = ({ route }) => {
//   const { questionData, selectedOptions } = route.params;
//   const itemsPerPage = 5; // Number of items per page

//   const [currentPage, setCurrentPage] = useState(1);

//   // Calculate the start and end index of items for the current page
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;

//   // Filter the question data based on the current page
//   const paginatedQuestions = questionData.slice(startIndex, endIndex);

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {paginatedQuestions.map((question, index) => (
//         <View key={startIndex + index} style={styles.card}>
//           <Text style={styles.questionText}>{question.question}</Text>
//           <Text>Options:</Text>
//           {["option1", "option2", "option3", "option4"].map((optionKey) => (
//             <Text
//               key={optionKey}
//               style={[
//                 styles.optionText,
//                 optionKey === question.answer ? styles.correctOption : null,
//                 optionKey === selectedOptions[startIndex + index]
//                   ? styles.selectedOption
//                   : null,
//               ]}
//             >
//               {question[optionKey]}
//             </Text>
//           ))}
//           <Text>Correct Answer: {question.answer}</Text>
//           {selectedOptions[startIndex + index] !== undefined ? (
//             <Text>
//               Selected Option:{" "}
//               {question[`option${selectedOptions[startIndex + index]}`]}
//             </Text>
//           ) : (
//             <Text>Selected Option: Unattempted Question</Text>
//           )}
//         </View>
//       ))}
//       {/* Pagination buttons */}
//       <View style={styles.pagination}>
//         <Button
//           title="Previous Page"
//           onPress={handlePrevPage}
//           disabled={currentPage === 1}
//         />
//         <Text>Page {currentPage}</Text>
//         <Button
//           title="Next Page"
//           onPress={handleNextPage}
//           disabled={endIndex >= questionData.length}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   optionText: {
//     marginBottom: 5,
//   },
//   correctOption: {
//     color: "green",
//   },
//   selectedOption: {
//     backgroundColor: "yellow",
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//   },
// });

// export default TestResult;
// ============================================Added Pagination Above =============================================================

// ============================Choose Exam Junk Code
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Border, Color, Padding } from "../GlobalStyles";
// import ChooseExamDropdown from "../Components/Dropdown/ChooseExamDropdown";
// import PrimaryButton from "../Components/Forms/PrimaryButton";
// import { useNavigation } from "@react-navigation/native";
// import { getTest } from "../Api/getTestApi";
// import * as ScreenOrientation from "expo-screen-orientation";
// import axios from "axios";
// import SecoundaryHeader from "../Components/Menus/SecoundaryHeader";

// const ChooseExam = ({}) => {
//   const [value, setValue] = useState("");
//   const navigation = useNavigation();

//   const [selectedExam, setSelectedExam] = useState("");
//   const [selectedSubExam, setSelectedSubExam] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [questionData, setQuestionData] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       // const data = await getExamCatList();
//       try {
//         const response = await axios.get("/get-question-paper", {
//           params: {
//             QPYearID: selectedYear,
//             catID: selectedExam,
//             subCatID: selectedSubExam,
//             // QPYearID: "65fbe4e408f4630559ebc7b1",
//             // catID: "65fbb34d448ff0837e9f686a",
//             // subCatID: "65fbbe316e86374ff7b0dfe1",
//           },
//         });
//         const data = response.data.data;
//         // console.log("Question :" + JSON.stringify(data));

//         setQuestionData(data);
//       } catch (error) {
//         console.error("Error fetching question paper:", error);
//       }
//     };

//     if (questionData.length === 0) {
//       fetchData();
//     }
//   }, []);

//   const onSubmitChooseExam = async () => {
//     console.log("Question Data in Submit Function : " + questionData);
//     navigation.navigate("TestPage", { questionData });
//   };

//   return (
//     <ScrollView>
//       <SecoundaryHeader pageName="Choose Exam" />

//       <Text style={styles.txt}>Please Select Question Paper to Start Exam</Text>
//       <ChooseExamDropdown
//         selectedExam={selectedExam}
//         setSelectedExam={setSelectedExam}
//         selectedSubExam={selectedSubExam}
//         setSelectedSubExam={setSelectedSubExam}
//         selectedYear={selectedYear}
//         setSelectedYear={setSelectedYear}
//       ></ChooseExamDropdown>
//       <PrimaryButton
//         styles={styles.button}
//         buttonTitle="Submit"
//         handleOnSubmit={onSubmitChooseExam}
//       ></PrimaryButton>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   txt: {
//     textAlign: "center",
//     marginTop: "20%",
//     fontSize: 20,
//     justifyContent: "center",
//     color: Color.red,
//     width: "90%",
//     alignSelf: "center",
//   },
//   button: {
//     // alignSelf: "center",
//     // alignContent: "center",
//     // alignItems: "center",
//     // width: "100%",
//     marginTop: "5%",
//   },
// });

// export default ChooseExam;
