import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Color } from "../../GlobalStyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const SolvedTestComponent = ({ testName, score, testDate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Solved Test</Text>
      <View style={styles.card}>
        <View>
          <Text>
            Test Name: <Text>{testName}</Text>
          </Text>
          <Text>
            Score: <Text>{score}</Text>
          </Text>
          <Text>
            Test Date: <Text>{testDate}</Text>
          </Text>
        </View>
        <View style={styles.btn}>
          <TouchableOpacity style={styles.btnResult}>
            <FontAwesome5 name="eye" style={styles.btnResultTxt} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <FontAwesome5 name="trash" style={styles.deleteButtonText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
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
    // borderBottom
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  container: {
    width: "95%",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
});

export default SolvedTestComponent;
