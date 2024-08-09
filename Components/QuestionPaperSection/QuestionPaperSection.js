import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import axios from "axios";
import { Color } from "../../GlobalStyles";
import LocalImage from "../../assets/exam.png"; // Update the path to your local image
import LocalImage2 from "../../assets/policeman.png"; // Update the path to your local image
import combine from "../../assets/combine.png"; // Update the path to your local image
import learning from "../../assets/learning.png"; // Update the path to your local image

const QuestionPaperSection = () => {
  const [categoryData, setCategoryData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        "/exam-categories/get-all-exam-category"
      );
      setCategoryData(
        response.data.map(({ _id, catName, catShortName, image }) => ({
          _id,
          catName,
          catShortName,
          image,
        }))
      );
      //   console.log("--->" + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate("QuestionPaperCardPage", { categoryId });
  };

  const getImageByIndex = (index) => {
    switch (index) {
      case 0:
        return learning; // Return different images based on index
      case 1:
        return combine;
      case 2:
        return LocalImage2;
      // Add more cases for additional images
      default:
        return LocalImage; // Default image if index doesn't match
    }
  };

  const renderCategoryItem = (category, index) => (
    <TouchableOpacity
      key={category._id}
      onPress={() => handleCategoryPress(category._id)}
      style={styles.categoryButton}
    >
      {/* <Image source={{ uri: category.image }} style={styles.categoryImage} /> */}
      {/* <Image source={LocalImage} style={styles.categoryImage} /> */}
      <Image source={getImageByIndex(index)} style={styles.categoryImage} />

      <View style={styles.categoryContent}>
        <Text style={styles.categoryButtonText}>
          {category.catShortName || category.catName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categoryData.map(renderCategoryItem)}
    </ScrollView>
  );
};

const screenWidth = Dimensions.get("window").width;
const cardWidthPercentage = 30; // Adjust as needed
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row", // Ensure horizontal layout
  },
  categoryButton: {
    width: screenWidth * (cardWidthPercentage / 100), // Calculate card width based on percentage
    height: 150, // Set a fixed height for the card
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 10,
    backgroundColor: Color.secoundaryBtnColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  categoryImage: {
    width: "100%", // Image takes full width of the card
    height: "70%", // Image takes half of the card height
    // width: 10,
    // height: 10,
    // resizeMode: "cover",
    borderRadius: 10,
  },
  categoryContent: {
    flex: 1, // Content takes remaining space
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default QuestionPaperSection;
