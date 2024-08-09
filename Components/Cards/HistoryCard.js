import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const HistoryCard = ({ testName, score, testDate, onDelete, onSummary }) => {
  // const rightSwipe = () => {
  //   return (
  //     <View style={styles.btn}>
  //       <TouchableOpacity style={styles.btnResult} onPress={onSummary}>
  //         {/* <Text style={styles.btnResultTxt}>View Result</Text> */}
  //         <FontAwesome5 name="eye" style={styles.btnResultTxt}></FontAwesome5>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
  //         {/* <Text style={styles.deleteButtonText}>Delete</Text> */}
  //         <FontAwesome5
  //           name="trash"
  //           style={styles.deleteButtonText}
  //         ></FontAwesome5>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
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
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <Swipeable renderRightActions={rightSwipe}> */}
      <View style={styles.cardConatiner}>
        <Text style={styles.cardTitle}>Solved Test</Text>
        <View style={styles.card}>
          <View>
            <Text>
              Test ID: <Text>{testName}</Text>
            </Text>
            <Text>
              Score : <Text>{score}</Text>
            </Text>
            <Text>
              Date : <Text>{formattedDateTime}</Text>
            </Text>
          </View>
          <View style={styles.btn}>
            <TouchableOpacity style={styles.btnResult} onPress={onSummary}>
              {/* <Text style={styles.btnResultTxt}>View Result</Text> */}
              <FontAwesome5
                name="eye"
                style={styles.btnResultTxt}
              ></FontAwesome5>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              {/* <Text style={styles.deleteButtonText}>Delete</Text> */}
              <FontAwesome5
                name="trash"
                style={styles.deleteButtonText}
              ></FontAwesome5>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* </Swipeable> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  deleteButtonText: {
    color: Color.colorWhite,
    fontWeight: "bold",
    fontSize: 20,
  },
  btnResultTxt: {
    color: Color.colorWhite,
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
    backgroundColor: Color.green,
    paddingHorizontal: 20,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.red,
    paddingHorizontal: 20,
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
    backgroundColor: Color.primaryColor,
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

export default HistoryCard;
