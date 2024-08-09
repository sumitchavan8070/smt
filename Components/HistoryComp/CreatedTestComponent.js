import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Feather from "react-native-vector-icons/Feather";

import { Color } from "../../GlobalStyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CreatedTestComponent = ({
  testName,
  questionLength,
  testDate,
  testId,
  preparedBy,
  onDelete,
  onShare,
  onView,
}) => {
  const changeDate = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Get day, month, year, hours, and minutes
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the date and time string
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDateTime;
  };

  // Example usage
  const originalDateTime = testDate;
  const formattedDateTime = changeDate(originalDateTime);
  // console.log(formattedDateTime); // Output: "16/04/2024 06:21"

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <Swipeable renderRightActions={rightSwipe}> */}
      <View style={styles.cardConatiner}>
        <Text style={styles.cardTitle}>Created Test</Text>
        <View style={styles.card}>
          <View>
            <Text style={styles.testId}>
              Test ID: <Text>{testId}</Text>
            </Text>
            <Text>
              Test Name: <Text>{testName}</Text>
            </Text>
            <Text>
              Toatl Question : <Text>{questionLength}</Text>
            </Text>
            <Text>
              Date : <Text>{formattedDateTime}</Text>
            </Text>
          </View>
          <View style={styles.btn}>
            <TouchableOpacity style={styles.btnResult} onPress={onShare}>
              {/* <Text style={styles.btnResultTxt}>View Result</Text> */}
              <Feather name="share" style={styles.btnResultTxt}></Feather>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onView}>
              <FontAwesome5
                name="eye"
                style={styles.deleteButtonText}
              ></FontAwesome5>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <MaterialIcons
                name="delete"
                style={styles.deleteButtonText}
              ></MaterialIcons>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* </Swipeable> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  testId: {
    fontWeight: "bold",
    color: Color.primaryColor,
  },
  deleteButtonText: {
    color: Color.red,
    fontWeight: "bold",
    fontSize: 20,
  },
  btnResultTxt: {
    color: Color.primaryColor,
    fontWeight: "bold",
    fontSize: 20,
  },
  btn: {
    // marginHorizontal: 10,
    // margin: 10,
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 10,
    // padding: 20,
    // marginBottom: 20,
    // backgroundColor: "#fff",
    // elevation: 5,
    gap: 5,
  },
  btnResult: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: Color.green,
    paddingHorizontal: 15,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: Color.red,
    paddingHorizontal: 15,
  },
  cardConatiner: {
    width: "95%",
    margin: 10,
    display: "flex",

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  card: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    backgroundColor: Color.yellow,
    color: Color.colorWhite,
    alignSelf: "flex-start",
    left: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
});
export default CreatedTestComponent;
