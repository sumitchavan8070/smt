import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import PaperCardsContainer from "./PaperCardsContainer";
import { Color } from "../../GlobalStyles";

import loadingAnimation from "../../assets/girl.json";
import LottieView from "lottie-react-native";
import PrimaryButton from "../Forms/PrimaryButton";
import LoadingAnimation from "../Loader/loader";
import { useNavigation } from "@react-navigation/native";

const QuestionPaperCardPage = ({ route }) => {
  const { categoryId } = route.params;
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/papers/${categoryId}`);
      // setPapers(response.data);
      // console.log("===>" + JSON.stringify(response));
      if (
        response.data &&
        response.data.length > 0 &&
        response.data.every((paper) => paper.questions.length > 0)
      ) {
        setPapers(response.data);
        setLoading(false);
      } else {
        setPapers([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching papers:", error);
    }
  };

  const onSolvePaper = () => {
    navigation.navigate("ChooseExam");
  };

  return (
    <>
      {loading && <LoadingAnimation visible={loading} loop={true} />}

      <ScrollView contentContainerStyle={styles.container}>
        {papers.length > 0 ? (
          <PaperCardsContainer papers={papers} />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <LottieView
              source={loadingAnimation}
              autoPlay
              loop={true}
              style={styles.animation}
            />
            <Text style={styles.noPaperText}>No Question paper found</Text>
            <PrimaryButton
              styles={styles.button}
              buttonTitle={loading ? "Loading..." : "Solve Paper"}
              handleOnSubmit={onSolvePaper}
              disabled={loading}
            />
          </ScrollView>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Color.colorWhite,
  },
  animation: {
    width: "100%",
    height: "80%",
    alignSelf: "center",
  },
  noPaperText: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default QuestionPaperCardPage;
