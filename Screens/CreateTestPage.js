import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import { Color, FontSize } from "../GlobalStyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RefreshControl } from "react-native-gesture-handler";

const CreateTestPage = ({
  selectedExamCategory,
  selectedSubExamType,
  selectedExamYear,
  setSelectedExamCategory,
  setSelectedSubExamType,
  setSelectedExamYear,
  yearDropIsVisible,
  setYearDropIsVisible,
  distDropIsVisible,
  setDistDropIsVisible,
  detailPageValue,
  selectedTimer,
  setSelectedTimer,
  createTest,
}) => {
  const [examCategories, setExamCategories] = useState([]);
  const [subExamTypes, setSubExamTypes] = useState([]);
  const [examYears, setExamYears] = useState([]);
  // const [selectedExamCategory, setSelectedExamCategory] = useState(null);
  // const [selectedSubExamType, setSelectedSubExamType] = useState(null);`
  // const [selectedExamYear, setSelectedExamYear] = useState(null);
  // const [yearDropIsVisible, setYearDropIsVisible] = useState(true);

  useEffect(() => {
    // Fetch exam categories on component mount
    fetchExamCategories();

    // if (detailPageValue._id) {
    //   fetchSubExamTypes(selectedExamCategory); // Fetch sub-exam types based on selected exam category
    // }
    if (detailPageValue && detailPageValue._id) {
      fetchSubExamTypes(selectedExamCategory); // Fetch sub-exam types based on selected exam category
    }
  }, []);

  useEffect(() => {
    if (examYears.length > 0) {
      setYearDropIsVisible(true);
    } else {
      setYearDropIsVisible(false);
      setSelectedExamYear(null);
    }
  }, [examYears]);

  const fetchExamCategories = async () => {
    try {
      const response = await axios.get(
        "/exam-categories/get-all-exam-category"
      );
      const examCategoriesData = response.data.map((category) => ({
        key: category._id,
        value: category.catName,
      }));
      setExamCategories(examCategoriesData);
    } catch (error) {
      console.error("Error fetching exam categories:", error);
    }
  };

  const fetchSubExamTypes = async (examCategoryId) => {
    try {
      const response = await axios.get(`/subcategories/${examCategoryId}`);

      // console.log("Subject Values Responce " + JSON.stringify(response.data));

      const subExamTypesData = response.data.map((type) => ({
        key: type._id,
        value: type.subCatName,
      }));
      setSubExamTypes(subExamTypesData);
    } catch (error) {
      console.error("Error fetching sub-exam types:", error);
    }
  };

  const fetchExamYears = async (examCategoryId, subExamTypeId) => {
    try {
      const response = await axios.get(
        `/years/${examCategoryId}/${subExamTypeId}`
      );
      // console.log("Year Responce " + JSON.stringify(response.data));

      const examYearsData = response.data.map((year) => ({
        key: year._id,
        value: year.QPYear,
      }));
      setExamYears(examYearsData);

      // console.log("examYears" + JSON.stringify(examYearsData));
    } catch (error) {
      console.error("Error fetching exam years:", error);
    }
  };

  const handleSubmit = () => {
    const selectedValues = {
      selectedExamCategory,
      selectedSubExamType,
      selectedExamYear,
    };
    console.log("Selected values:", selectedValues);
    // Make further API calls or perform actions based on selected values
  };

  const hadleExamYearNotFound = () => {
    setSelectedExamYear(null);
  };

  const timerData = [
    { key: "1", value: "Yes" },
    { key: "2", value: "No" },
  ];

  return (
    <View style={[styles.drop]}>
      {!createTest && (
        <View style={[styles.dropContainer]}>
          <Text style={styles.labelText}>Timer Visiblity</Text>
          <SelectList
            onSelect={async () => {
              // await fetchSubExamTypes(selectedExamCategory); // Fetch sub-exam types based on selected exam category
              // console.log(selectedTimer);
            }}
            setSelected={setSelectedTimer}
            data={timerData}
            arrowicon={
              <FontAwesome5
                name="chevron-down"
                size={12}
                color={Color.primaryColor}
              />
            }
            search={false}
            boxStyles={{
              borderRadius: 15,
              borderColor: Color.colorBlack,
              borderWidth: 1,
              borderStyle: "solid",
            }}
            placeholder={
              detailPageValue
                ? detailPageValue.catName
                : "Please Select Timer Visiblity"
            }
            dropdownStyles={{
              borderColor: Color.primaryColor,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          />
        </View>
      )}

      {/* ======================================= Select Examination ==================================== */}

      <View style={[styles.dropContainer]}>
        <Text style={styles.labelText}>Select Exam</Text>
        <SelectList
          onSelect={async () => {
            await fetchSubExamTypes(selectedExamCategory); // Fetch sub-exam types based on selected exam category
          }}
          setSelected={setSelectedExamCategory}
          data={examCategories}
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
          search={true}
          boxStyles={{
            borderRadius: 15,
            borderColor: Color.colorBlack,
            borderWidth: 1,
            borderStyle: "solid",
          }}
          placeholder={
            detailPageValue ? detailPageValue.catName : "Please Select Exam"
          }
          dropdownStyles={{
            borderColor: Color.primaryColor,
            borderWidth: 1,
            borderStyle: "solid",
          }}
        />
      </View>

      {/* ======================================= Select Exam Type ==================================== */}
      <View style={[styles.dropContainer]}>
        <Text style={styles.labelText}>Select Type</Text>

        <SelectList
          onSelect={async () => {
            await fetchExamYears(selectedExamCategory, selectedSubExamType);
          }}
          setSelected={setSelectedSubExamType}
          // fontFamily="lato"
          data={subExamTypes}
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
        {yearDropIsVisible ? (
          <>
            <Text style={styles.labelText}>Select Year</Text>
            <SelectList
              onSelect={async () => {
                await fetchExamYears(selectedExamCategory, selectedSubExamType); // Fetch exam years based on selected exam category and sub-exam type
              }}
              setSelected={setSelectedExamYear}
              // fontFamily="lato"
              data={examYears}
              arrowicon={
                <FontAwesome5
                  name="chevron-down"
                  size={12}
                  color={Color.primaryColor}
                />
              }
              searchicon={
                <FontAwesome5
                  name="search"
                  size={12}
                  color={Color.primaryColor}
                />
              }
              search={false}
              boxStyles={{
                borderRadius: 15,
                borderColor: Color.colorBlack,
                borderWidth: 1,
                borderStyle: "solid",
              }}
              placeholder="Please Select Year"
              dropdownStyles={{
                borderColor: Color.primaryColor,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            />
          </>
        ) : (
          // <View style={[styles.disabledDropdown]}>
          //   <Text style={styles.disabledText}>Please Select Year</Text>
          //   <FontAwesome5
          //     name="chevron-down"
          //     size={12}
          //     color={Color.colorRed}
          //     style={{ marginRight: 5 }}
          //   />
          // </View>
          ""
        )}
      </View>

      {/* //============================================== Select District ===================================== */}
      {/* <View style={[styles.dropContainer]}>
        {distDropIsVisible ? (
          <SelectList
            onSelect={async () => {
              // await fetchExamYears(selectedExamCategory, selectedSubExamType); // Fetch exam years based on selected exam category and sub-exam type
            }}
            setSelected={setSelectedExamYear}
            // fontFamily="lato"
            data={examYears}
            arrowicon={
              <FontAwesome5
                name="chevron-down"
                size={12}
                color={Color.primaryColor}
              />
            }
            searchicon={
              <FontAwesome5
                name="search"
                size={12}
                color={Color.primaryColor}
              />
            }
            search={false}
            boxStyles={{
              borderRadius: 15,
              borderColor: Color.colorBlack,
              borderWidth: 1,
              borderStyle: "solid",
            }}
            placeholder="Please Select District/Region"
            dropdownStyles={{
              borderColor: Color.primaryColor,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          />
        ) : (
          // <View style={[styles.disabledDropdown]}>
          //   <Text style={styles.disabledText}>
          //     Please Select District/Region
          //   </Text>
          //   <FontAwesome5
          //     name="chevron-down"
          //     size={12}
          //     color={Color.colorRed}
          //     style={{ marginRight: 5 }}
          //   />
          // </View>
          ""
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    color: Color.primaryColor,
    fontWeight: "bold",
    left: 10,
    paddingVertical: 5,
  },
  disabledDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Color.red,
    backgroundColor: Color.secoundaryBtnColor,
  },
  disabledText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: Color.colorRed,
  },
  dropContainer: {
    // bottom: "10%",
    marginBottom: 15,
  },
  drop: {
    paddingHorizontal: "8%",
    paddingVertical: "10%",
    // marginTop: "10%",
  },
  placeholder: {
    fontSize: FontSize.size_xs,
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
  },
});

export default CreateTestPage;
