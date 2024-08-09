import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export const getTest = async () => {
  try {
    const response = await axios.get("/get-question-paper", {
      params: {
        QPYearID: "65fbe4e408f4630559ebc7b1",
        catID: "65fbb34d448ff0837e9f686a",
        subCatID: "65fbbe316e86374ff7b0dfe1",
      },
    });
    const data = response.data.data; // Extract data object from the response
    console.log("Question :" + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching exam categories:", error);
  }
};

// export const getTestData = async () => {
//   try {
//     const jsonTestData = await AsyncStorage.getItem("testData");
//     if (jsonTestData !== null) {
//       const testData = JSON.parse(jsonTestData);
//       console.log("Retrieved test data:", testData);
//       return testData;
//     } else {
//       console.log("No test data found");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error retrieving test data:", error);
//     return null;
//   }
// };

export const getTestData = async () => {
  const currentTime = new Date().getTime().toString(); // Get current time as a string
  try {
    const jsonValue = await AsyncStorage.getItem(`testData_${currentTime}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving test data:", e);
  }
};
