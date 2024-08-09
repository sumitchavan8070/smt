// import axios from "axios";
// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AddPollModal = ({ visible, onClose, onAddPoll }) => {
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(Array(4).fill(""));
//   const [answer, setAnswer] = useState("");

//   const handleAddPollConfirm = async () => {
//     try {
//       if (!question || !options.every((option) => option !== "") || !answer) {
//         alert("Please fill all fields.");
//         return;
//       }

//       const data = await AsyncStorage.getItem("@auth");
//       let loginData = JSON.parse(data);
//       let userId = loginData.user._id;

//       const response = await axios.post("/add-user-post", {
//         title: "New Poll Post",
//         content: "Poll content",
//         type: "poll",
//         approved: false,
//         postedBy: userId,
//         poll: {
//           question,
//           options,
//           answer,
//           votes: {},
//         },
//       });

//       console.log(response.data);

//       onClose();
//     } catch (error) {
//       console.error("Error adding poll:", error);
//     }
//   };

//   return (
//     <View style={styles.modalContainer}>
//       <View style={styles.modalContent}>
//         <Text style={styles.modalTitle}>Add Poll</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Question"
//           value={question}
//           onChangeText={setQuestion}
//         />
//         {options.map((option, index) => (
//           <TextInput
//             key={index}
//             style={styles.input}
//             placeholder={`Option ${index + 1}`}
//             value={option}
//             onChangeText={(text) =>
//               setOptions((prevOptions) => {
//                 const updatedOptions = [...prevOptions];
//                 updatedOptions[index] = text;
//                 return updatedOptions;
//               })
//             }
//           />
//         ))}
//         <TextInput
//           style={styles.input}
//           placeholder="Answer"
//           value={answer}
//           onChangeText={setAnswer}
//         />
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={handleAddPollConfirm}
//         >
//           <Text style={styles.addButtonText}>Add Poll</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <Text style={styles.closeButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     width: "95%",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 10,
//     padding: 5,
//   },
//   addButton: {
//     backgroundColor: "#6949ff",
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   closeButton: {
//     paddingVertical: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: "#555",
//     fontWeight: "bold",
//   },
// });

// export default AddPollModal;

// import axios from "axios";
// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5 for check mark icon

// const AddPollModal = ({ visible, onClose, onAddPoll }) => {
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(Array(4).fill(""));
//   const [selectedOption, setSelectedOption] = useState(null); // State to track the selected option

//   const handleAddPollConfirm = async () => {
//     try {
//       if (
//         !question ||
//         !options.every((option) => option !== "") ||
//         !selectedOption
//       ) {
//         // Check if all fields are filled
//         alert("Please fill all fields.");
//         return;
//       }

//       const data = await AsyncStorage.getItem("@auth");
//       let loginData = JSON.parse(data);
//       let userId = loginData.user._id;

//       const response = await axios.post("/add-user-post", {
//         title: "New Poll Post",
//         content: "Poll content",
//         type: "poll",
//         approved: false,
//         postedBy: userId,
//         poll: {
//           question,
//           options,
//           answer: selectedOption, // Save the selected option as the answer
//           votes: {},
//         },
//       });

//       console.log(response.data);

//       onClose();
//     } catch (error) {
//       console.error("Error adding poll:", error);
//     }
//   };

//   // const handleOptionSelect = (index) => {
//   //   setSelectedOption(options[index]); // Update the selected option
//   // };

//   const handleOptionSelect = (index) => {
//     // Update the selected option only if it's different from the currently selected one
//     if (selectedOption !== options[index]) {
//       setSelectedOption(options[index]);
//     } else {
//       setSelectedOption(null); // Deselect the option if it's already selected
//     }
//   };

//   return (
//     <View style={styles.modalContainer}>
//       <View style={styles.modalContent}>
//         <Text style={styles.modalTitle}>Add Poll</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Question"
//           value={question}
//           onChangeText={setQuestion}
//         />
//         {options.map((option, index) => (
//           <View key={index} style={styles.optionContainer}>
//             <FontAwesome5
//               name={selectedOption === option ? "check-circle" : "circle"} // Show check mark for selected option
//               size={20}
//               color={selectedOption === option ? "#6949ff" : "#ccc"} // Change color for selected option
//               onPress={() => handleOptionSelect(index)} // Handle option selection
//               style={styles.checkIcon}
//             />
//             <TextInput
//               style={styles.optionInput}
//               placeholder={`Option ${index + 1}`}
//               value={option}
//               onChangeText={(text) =>
//                 setOptions((prevOptions) => {
//                   const updatedOptions = [...prevOptions];
//                   updatedOptions[index] = text;
//                   return updatedOptions;
//                 })
//               }
//             />
//           </View>
//         ))}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={handleAddPollConfirm}
//         >
//           <Text style={styles.addButtonText}>Add Poll</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <Text style={styles.closeButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     width: "95%",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 10,
//     padding: 5,
//   },
//   optionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   checkIcon: {
//     marginRight: 10,
//   },
//   optionInput: {
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     flex: 1,
//     padding: 5,
//   },
//   addButton: {
//     backgroundColor: "#6949ff",
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   closeButton: {
//     paddingVertical: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: "#555",
//     fontWeight: "bold",
//   },
// });

// export default AddPollModal;

import axios from "axios";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome5 for check mark icon
import { Color } from "../../GlobalStyles";
import PostAlert from "../Alert/PostAlert";
import LoadingAnimation from "../Loader/loader";

const AddPollModal = ({ visible, onClose, onAddPoll }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(Array(4).fill(""));
  const [selectedOption, setSelectedOption] = useState(null); // State to track the selected option

  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPollConfirm = async () => {
    setLoading(true); // Start loading animation

    try {
      Keyboard.dismiss();

      if (!question.trim()) {
        alert("Please enter the question.");
        return;
      }

      if (!options.every((option) => option !== "")) {
        alert("Please fill all options.");
        return;
      }

      if (!selectedOption) {
        alert("Please Select the Checkbox to Set Answser.");
        return;
      }

      const data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      let userId = loginData.user._id;

      const response = await axios.post("/add-user-post", {
        title: question,
        content: "Poll content",
        type: "poll",
        approved: false,
        postedBy: userId,
        poll: {
          question,
          options,
          answer: selectedOption, // Save the selected option as the answer
          votes: {},
        },
      });

      console.log(response.data);

      // onClose();

      setShowAlert(true);
      setAlertMessage(
        "Your poll has been submitted successfully and is awaiting review by our team. Thank you!"
      );
    } catch (error) {
      console.error("Error adding poll:", error);
      Keyboard.dismiss();
      setShowAlert(true);
      setAlertMessage("Appreciated Efforts.. But Please Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    // setImage(null);
    // setDescription("");
    setShowAlert(false);
    onClose();
  };

  const handleOptionSelect = (index) => {
    // Update the selected option only if it's different from the currently selected one
    if (selectedOption !== options[index]) {
      setSelectedOption(options[index]);
    } else {
      setSelectedOption(null); // Deselect the option if it's already selected
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {loading && <LoadingAnimation visible={loading} loop={true} />}

        {showAlert && (
          <PostAlert
            isVisible={showAlert}
            onClose={handleOnClose}
            message={alertMessage}
          />
        )}
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Add Poll</Text>

          {selectedOption && (
            <Text style={styles.selectedAnswer}>
              Selected Answer: {selectedOption}
            </Text>
          )}
          {/* Display selected answer */}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
        />
        {options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <FontAwesome5
              name={selectedOption === option ? "check-circle" : "circle"} // Show check mark for selected option
              size={20}
              color={selectedOption === option ? "#6949ff" : "#ccc"} // Change color for selected option
              onPress={() => handleOptionSelect(index)} // Handle option selection
              style={styles.checkIcon}
            />
            <TextInput
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) =>
                setOptions((prevOptions) => {
                  const updatedOptions = [...prevOptions];
                  updatedOptions[index] = text;
                  return updatedOptions;
                })
              }
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPollConfirm}
        >
          <Text style={styles.addButtonText}>Add Poll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "95%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 10,
  },
  optionInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    padding: 5,
  },
  addButton: {
    backgroundColor: "#6949ff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#555",
    fontWeight: "bold",
  },
  selectedAnswer: {
    fontWeight: "bold",
    color: Color.green,

    alignSelf: "center",
  },
});

export default AddPollModal;
