import axios from "axios";

//Get All Exam Categories
export const getExamCatList = async () => {
  try {
    const response = await axios.get("/exam-categories/get-all-exam-category");
    const data = response.data; // Extract data object from the response
    // console.log("Exam Cat Data :" + JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Error fetching exam categories:", error);
  }
};
