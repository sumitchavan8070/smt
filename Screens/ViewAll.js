import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import LoadingAnimation from "../Components/Loader/loader";
import { getExamCatList } from "../Api/examCatApi";
import { Color } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const ViewAllPage = ({}) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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

  const handleMoreButton = (_id) => {
    navigation.navigate("ExamDetail", { _id: _id });
  };

  const colorTray = [Color.red, Color.green, Color.primaryColor, Color.yellow];

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.gridContainer}>
            {categoriesData.map((item, index) => (
              <View
                key={item._id}
                style={[
                  styles.gridItem,
                  { backgroundColor: colorTray[index % colorTray.length] },
                ]}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleMoreButton(item._id)}
                >
                  <Text style={styles.text}>{item?.catName}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  container: {
    padding: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    aspectRatio: 1, // This maintains a square aspect ratio for each item
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ViewAllPage;
