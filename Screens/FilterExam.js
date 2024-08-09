import { View, Text } from "react-native";
import React from "react";
import ChooseExam from "./ChooseExam";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Color, Padding } from "../GlobalStyles";
import SubjectFilter from "../Components/FilterExam/SubjectFilter";
import TopicFilter from "../Components/FilterExam/TopicFilter";

const FilterExam = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.primaryColor, // Active tab text color
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          tabBarIndicatorStyle: {
            backgroundColor: Color.primaryColor, // Color of the indicator
            height: 2, // Height of the indicator
          },
        }}
      >
        <Tab.Screen name="Exam" component={ChooseExam} />
        <Tab.Screen name="Subject" component={SubjectFilter} />
        <Tab.Screen name="Topic" component={TopicFilter} />
      </Tab.Navigator>
    </View>
  );
};

export default FilterExam;
