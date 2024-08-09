import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getExamCatList } from "../Api/examCatApi";
import { Image } from "expo-image";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import HTML from "react-native-render-html";
import SecoundaryHeader from "../Components/Menus/SecoundaryHeader";

const ExamDetailPage = ({ route }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [eDetails, setEDetails] = useState({});
  const navigation = useNavigation();

  // // Get Exam Detail - This Effect Runs Mutilple time
  // useEffect(
  //   () => {
  //     const fetchData = async () => {
  //       const data = await getExamCatList();
  //       setCategoriesData(data);
  //     };
  //     fetchData();
  //     //find product details
  //     const getExam = categoriesData.find((item) => {
  //       console.log("Im Param Id " + params?._id);
  //       return item?._id === params?._id;
  //     });
  //     console.log("getExam" + JSON.stringify(getExam, null, 4));
  //     setEDetails(getExam);
  //   },
  //   // [params?._id, categoriesData]);
  //   [params?._id, categoriesData]
  // );

  // Get Exam Detail
  useEffect(() => {
    const fetchData = async () => {
      const data = await getExamCatList();
      setCategoriesData(data);

      // Find product details after fetching categories data
      const getExam = data.find((item) => item._id === params?._id);
      //  console.log("getExam", getExam);
      setEDetails(getExam);
    };

    // Fetch data only when categoriesData is empty
    if (categoriesData.length === 0) {
      fetchData();
    }
  }, [params?._id, categoriesData]); // Dependency array ensures useEffect runs when these values change

  //console.log(route);
  const { params } = route;

  const handleSolveBtn = () => {
    const examDetailCatName = eDetails.catName; // Replace "your_exam_detail_id" with the actual ID
    const examDetailId = eDetails._id;

    const detailPageValue = {
      _id: examDetailId, // Initialize with empty string or set the actual ID if available
      catName: examDetailCatName,
    };

    navigation.navigate("ChooseExam", {
      detailPageValue: detailPageValue,
    });
  };

  const handleModifyBtn = () => {
    // navigation.navigate("ChooseExam");
    const examDetailCatName = eDetails.catName; // Replace "your_exam_detail_id" with the actual ID
    const examDetailId = eDetails._id;

    const detailPageValue = {
      _id: examDetailId, // Initialize with empty string or set the actual ID if available
      catName: examDetailCatName,
    };

    navigation.navigate("ChooseExam", {
      detailPageValue: detailPageValue,
    });
  };

  const { width } = useWindowDimensions(); // Destructure width from useWindowDimensions()
  const containsHTML = /<[a-z][\s\S]*>/i.test(eDetails?.des);

  const pdfUri =
    "https://dagrs.berkeley.edu/sites/default/files/2020-01/sample.pdf"; // Replace with your PDF URL

  return (
    <View style={styles.main}>
      <SecoundaryHeader pageName="Exam Details" />

      <ScrollView style={styles.container}>
        {/* // <Text>ExamDetailPage{JSON.stringify(eDetails, null, 4)}</Text> */}

        <View style={styles.headingCard}>
          <Image style={[styles.catimg]} source={{ uri: eDetails?.image }} />
          <Text style={styles.title}>{eDetails?.catName}</Text>
        </View>

        {/* <View style={styles.discriptionConatiner}>
          <Text style={styles.desText}>{eDetails?.des}</Text>
        </View> */}

        {/* Latest Notification - We will Scedule to fetch data  */}

        {/* <View style={styles.latestCard}>
          <Text style={styles.cardTxt}>
            Latest Notfiaction Date : <Text>20/12/2022</Text>
          </Text>
          <Text style={styles.cardTxt}>
            Last Date to Apply : <Text>20/12/2022</Text>
          </Text>
          <Text style={styles.cardTxt}>
            Number of Vaccancy : <Text>0</Text>
          </Text>
          <Text style={styles.cardTxt}>
            View Ad : <Text>link</Text>
          </Text>
        </View> */}

        <View style={[styles.descriptionContainer]}>
          {/* Render HTML content using react-native-render-html if 'des' contains HTML */}
          {containsHTML ? (
            <HTML source={{ html: eDetails?.des }} contentWidth={width} />
          ) : (
            <Text style={styles.desText}>{eDetails?.des}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btnModify} onPress={handleModifyBtn}>
          <Text style={styles.txtModify}>Modify Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSolve} onPress={handleSolveBtn}>
          <Text style={styles.txtSolve}>Solve Paper</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: Color.colorWhite },
  htmlContainer: {
    // flex: 1,
    borderWidth: 10,
    borderColor: "red", // Default border color
  },
  // main: { gap: 100 },
  cardTxt: {
    color: Color.colorWhite,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    margin: 5,
    left: "5%",
  },
  latestCard: {
    backgroundColor: Color.red,
    display: "flex",
    width: "95%",
    marginBottom: "10%",
    // height: 200,
    // alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  // btnContainer: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginHorizontal: "8%",
  //   paddingHorizontal: 20,
  //   width: "80%",
  //   // backgroundColor: Color.secoundaryBtnColor,
  //   position: "absolute",
  //   bottom: "10%",
  //   height: "8%",
  //   alignContent: "center",
  //   alignItems: "center",
  //   borderRadius: 15,
  // },
  // btnSolve: {
  //   backgroundColor: Color.primaryColor,
  //   borderRadius: Border.br_3xs,
  //   backgroundColor: Color.primaryColor,
  //   // width: 157,
  //   // height: 48,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   paddingHorizontal: Padding.p_16xl,
  //   paddingVertical: 13,
  //   marginHorizontal: 50,
  // },
  // btnModify: {
  //   borderRadius: Border.br_3xs,
  //   backgroundColor: Color.secoundaryBtnColor,
  //   borderStyle: "solid",
  //   borderColor: Color.primaryColor,
  //   borderWidth: 1,
  //   // width: 157,
  //   // height: 48,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   paddingHorizontal: Padding.p_16xl,
  //   paddingVertical: Padding.p_2xs,
  // },

  // txtModify: {
  //   fontSize: FontSize.size_xs,
  //   textTransform: "capitalize",
  //   fontWeight: "700",
  //   // fontFamily: FontFamily.interBold,
  //   color: Color.primaryColor,
  //   textAlign: "center",
  // },
  // txtSolve: {
  //   fontSize: FontSize.size_xs,
  //   textTransform: "capitalize",
  //   fontWeight: "700",
  //   // fontFamily: FontFamily.interBold,
  //   color: Color.colorWhite,
  //   textAlign: "center",
  // },

  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: "10%",
    height: "8%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 15,
  },
  btnSolve: {
    backgroundColor: Color.primaryColor,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: 13,
  },
  btnModify: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.secoundaryBtnColor,
    borderStyle: "solid",
    borderColor: Color.primaryColor,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: Padding.p_2xs,
  },

  txtModify: {
    fontSize: FontSize.size_xs,
    textTransform: "capitalize",
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.primaryColor,
    textAlign: "center",
  },
  txtSolve: {
    fontSize: FontSize.size_xs,
    textTransform: "capitalize",
    fontWeight: "700",
    // fontFamily: FontFamily.interBold,
    color: Color.colorWhite,
    textAlign: "center",
  },

  descriptionContainer: {
    backgroundColor: Color.secoundaryBtnColor,
    margin: 10,
    padding: 20,
    borderRadius: 15,
    width: "95%",
    marginBottom: "20%",
  },
  desText: {
    textAlign: "left",
    padding: 10,
    fontSize: FontSize.size_sm,
    marginBottom: 50,
  },
  headingCard: {
    // backgroundColor: Color.primaryColor,
    // borderRadius: 15,
  },
  container: {
    backgroundColor: Color.colorWhite,
    marginTop: "15%",
  },
  catimg: {
    height: 200,
    width: "95%",
    margin: 10,
    borderRadius: 15,
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowColor: Color.primaryColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    // borderColor: Color.primaryColor,
    // borderWidth: 2,
  },
  title: {
    textTransform: "uppercase",
    fontWeight: "600",
    // fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    // display: "flex",
    justifyContent: "center",
    width: "95%",
    // height: 24,
    textAlign: "left",
    fontSize: FontSize.size_lg,
    alignItems: "center",
    margin: 10,
  },
});

export default ExamDetailPage;
