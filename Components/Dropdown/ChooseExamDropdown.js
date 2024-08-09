import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Border, Color, FontSize, Padding } from "../../GlobalStyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
const ChooseExamDropdown = ({
  selectedExam,
  selectedSubExam,
  selectedYear,
  setSelectedExam,
  setSelectedSubExam,
  setSelectedYear,
}) => {
  const [examinationData, setExaminationData] = useState([]);
  const [subCatData, setsubCatData] = useState([]);
  const [yearData, setYearData] = useState([]);

  // ======================================== Get All Exam API =======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        let requestData = {};
        const response = await axios.get("/get-all-exam-category", {
          data: requestData,
        });
        if (response.data.success) {
          const exam = response.data.data.map((item) => ({
            key: item._id,
            value: item.catName,
          }));

          setExaminationData(exam);
        } else {
          console.error(
            "API request was not successful: Exam API",
            response.data.message
          );
        }
      } catch (error) {
        console.log("Error fetching data -Exam API:", error);
      }
    };
    if (examinationData.length === 0) {
      fetchData();
    }
  }, []);
  const onSelectExam = () => {
    console.log("Selected Value Exam API : " + selectedExam);
  };

  // ======================================== Get All SUb Exam API =======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          // catId: selectedExam,
        };
        const response = await axios.get(
          "/get-all-sub-category"
          // , {
          //   params: requestData, // Send data as query parameters
          // }
        );

        if (response.data.success) {
          const exam = response.data.data.map((item) => ({
            key: item._id,
            value: item.subCatName,
          }));

          setsubCatData(exam);
        } else {
          console.error(
            "API request was not successful: Sub Exam API",
            response.data.message
          );
        }
      } catch (error) {
        console.log("Error fetching data -Sub Exam API:", error);
      }
    };
    if (subCatData.length === 0) {
      fetchData();
    }
  }, []);

  const onSelectSubExam = () => {
    console.log("Selected Value Sub Exam API : " + selectedSubExam);
  };

  const onSelectYear = () => {
    console.log("Selected Value Sub Exam API : " + selectedYear);
  };

  // ========================================All Year =================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          // catId: selectedExam,
        };
        const response = await axios.get("/get-all-year");

        if (response.data.success) {
          const exam = response.data.data.map((item) => ({
            key: item._id,
            value: item.QPYear,
          }));
          console.log("Year Data : " + JSON.stringify(exam));

          setYearData(exam);
        } else {
          console.error(
            "API request was not successful: Year API",
            response.data.message
          );
        }
      } catch (error) {
        console.log("Error fetching data -Year API:", error);
      }
    };
    if (yearData.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <View style={[styles.drop]}>
      {/* ======================================= Select Examination ==================================== */}

      {/* https://github.com/danish1658/react-native-dropdown-select-list?tab=readme-ov-file */}

      <View style={[styles.dropContainer]}>
        <SelectList
          onSelect={onSelectExam}
          setSelected={setSelectedExam}
          data={examinationData}
          arrowicon={
            <FontAwesome5
              name="chevron-down"
              size={12}
              color={Color.primaryColor}
            />
          }
          searchicon={
            <FontAwesome5 name="search" size={12} color={Color.primaryColor} />
          }
          search={false}
          boxStyles={{
            borderRadius: 15,
            borderColor: Color.colorBlack,
            borderWidth: 1,
            borderStyle: "solid",
          }}
          placeholder="Please Select Exam"
          dropdownStyles={{
            borderColor: Color.primaryColor,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      </View>

      {/* ======================================= Select Exam Type ==================================== */}
      <View style={[styles.dropContainer]}>
        <SelectList
          onSelect={onSelectSubExam}
          setSelected={setSelectedSubExam}
          // fontFamily="lato"
          data={subCatData}
          arrowicon={
            <FontAwesome5
              name="chevron-down"
              size={12}
              color={Color.primaryColor}
            />
          }
          searchicon={
            <FontAwesome5 name="search" size={12} color={Color.primaryColor} />
          }
          search={false}
          boxStyles={{
            borderRadius: 15,
            borderColor: Color.colorBlack,
            borderWidth: 1,
            borderStyle: "solid",
            //  marginBottom: "10%",
          }} //override default styles
          // defaultOption={subCatData[examinationData][0]} //default selected option
          placeholder="Please Select Exam Type"
          dropdownStyles={{
            borderColor: Color.primaryColor,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      </View>

      {/* ======================================= Select Year  ==================================== */}
      <View style={[styles.dropContainer]}>
        <SelectList
          onSelect={onSelectYear}
          setSelected={setSelectedYear}
          // fontFamily="lato"
          data={yearData}
          arrowicon={
            <FontAwesome5
              name="chevron-down"
              size={12}
              color={Color.primaryColor}
            />
          }
          searchicon={
            <FontAwesome5 name="search" size={12} color={Color.primaryColor} />
          }
          search={false}
          boxStyles={{
            borderRadius: 15,
            borderColor: Color.colorBlack,
            borderWidth: 1,
            borderStyle: "solid",
            //  marginBottom: "10%",
          }} //override default styles
          // defaultOption={subCatData[examinationData][0]} //default selected option
          placeholder="Please Select Year"
          dropdownStyles={{
            borderColor: Color.primaryColor,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropContainer: {
    // bottom: "10%",
    marginBottom: "10%",
  },
  drop: {
    paddingHorizontal: "8%",
    paddingVertical: "10%",
    marginTop: "10%",
  },
  placeholder: {
    fontSize: FontSize.size_xs,
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
  },
});

export default ChooseExamDropdown;

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(apiEndPoint, {
//         data: {},
//       });
//       if (response.data.success) {
//         const categories = response.data.data.map((item) => ({
//           key: item._id,
//           value: item[value],
//         }));
//         // console.log("value" + value),
//         setData(categories);
//       } else {
//         console.error(
//           "API request was not successful:",
//           response.data.message
//         );
//       }
//     } catch (error) {
//       console.log("Error fetching data:", error);
//     }
//   };

//   fetchData();

//   return () => {};
// }, []);
