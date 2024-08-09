import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ExamCard from "./ExamCard";
import { categoriesData } from "../../data/CategoriesData";
import { getExamCatList } from "../../Api/examCatApi";
import LoadingAnimation from "../Loader/loader";

const Exam = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(
  //   () => {
  //     const fetchData = async () => {
  //       const data = await getExamCatList();
  //       setCategoriesData(data);
  //     };

  //     fetchData();
  //   },
  //   // [categoriesData]);
  //   []
  // );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getExamCatList();
      setCategoriesData(data);
      setLoading(false);
    };

    if (categoriesData.length === 0) {
      fetchData();
    }
  }, [categoriesData]); // Empty dependency array ensures useEffect runs only once when the component mounts

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {categoriesData.map((item) => (
            <ExamCard key={item._id} item={item} />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    display: "flex",
    paddingVertical: 10,
  },
});

export default Exam;
