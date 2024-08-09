// import React, { useState, useCallback } from "react";
// import { GiftedChat, InputToolbar, Composer } from "react-native-gifted-chat";
// import { TouchableOpacity, Text, TextInput, View } from "react-native";

// const ChatScreen = () => {
//   const [messages, setMessages] = useState([]);
//   const [showInput, setShowInput] = useState(false);
//   const [testIdInput, setTestIdInput] = useState("");

//   const handlePressPlusIcon = () => {
//     setShowInput(true);
//   };

//   const handleCancelInput = () => {
//     setShowInput(false);
//     setTestIdInput("");
//   };

//   const handleConfirmInput = () => {
//     if (testIdInput.trim() !== "") {
//       onSend([{ text: `Test ID: ${testIdInput}` }]);
//       setShowInput(false);
//       setTestIdInput("");
//     }
//   };

//   const onSend = useCallback((newMessages = []) => {
//     setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
//   }, []);

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(newMessages) => onSend(newMessages)}
//       user={{
//         _id: 1,
//       }}
//       renderInputToolbar={(props) => (
//         <CustomInputToolbar
//           {...props}
//           showInput={showInput}
//           testIdInput={testIdInput}
//           setTestIdInput={setTestIdInput}
//           onCancelInput={handleCancelInput}
//           onConfirmInput={handleConfirmInput}
//           onPlusPress={handlePressPlusIcon} // Pass the function to CustomInputToolbar
//         />
//       )}
//     />
//   );
// };

// const CustomInputToolbar = (props) => {
//   const {
//     showInput,
//     testIdInput,
//     setTestIdInput,
//     onCancelInput,
//     onConfirmInput,
//     onPlusPress, // Receive onPlusPress from ChatScreen
//   } = props;

//   if (showInput) {
//     return (
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <TextInput
//           placeholder="Enter Test ID"
//           value={testIdInput}
//           onChangeText={setTestIdInput}
//           style={{ flex: 1, borderWidth: 1, borderColor: "gray", padding: 8 }}
//         />
//         <TouchableOpacity onPress={onConfirmInput} style={{ marginLeft: 8 }}>
//           <Text>Submit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={onCancelInput} style={{ marginLeft: 8 }}>
//           <Text>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <InputToolbar {...props}>
//       <TouchableOpacity onPress={onPlusPress}>
//         <Text style={{ fontSize: 18, color: "#007AFF" }}>+</Text>
//       </TouchableOpacity>
//     </InputToolbar>
//   );
// };

// export default ChatScreen;

/// direct get tool bar

import React, { useState, useCallback } from "react";
import { GiftedChat, InputToolbar, Composer } from "react-native-gifted-chat";
import { TouchableOpacity, Text, TextInput, View } from "react-native";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [showInput, setShowInput] = useState(true); // Initialize to true
  const [testIdInput, setTestIdInput] = useState("");

  const handleToggleInput = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const handleCancelInput = () => {
    setShowInput(false);
    setTestIdInput("");
  };

  const handleConfirmInput = () => {
    if (testIdInput.trim() !== "") {
      onSend([{ text: `Test ID: ${testIdInput}` }]);
      setShowInput(false);
      setTestIdInput("");
    }
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: 1,
      }}
      renderInputToolbar={(props) => (
        <CustomInputToolbar
          {...props}
          showInput={showInput}
          testIdInput={testIdInput}
          setTestIdInput={setTestIdInput}
          onCancelInput={handleCancelInput}
          onConfirmInput={handleConfirmInput}
          onToggleInput={handleToggleInput} // Pass the function to CustomInputToolbar
        />
      )}
    />
  );
};

const CustomInputToolbar = (props) => {
  const {
    showInput,
    testIdInput,
    setTestIdInput,
    onCancelInput,
    onConfirmInput,
    onToggleInput, // Receive onToggleInput from ChatScreen
  } = props;

  if (showInput) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Enter Test ID"
          value={testIdInput}
          onChangeText={setTestIdInput}
          style={{ flex: 1, borderWidth: 1, borderColor: "gray", padding: 8 }}
        />
        <TouchableOpacity onPress={onConfirmInput} style={{ marginLeft: 8 }}>
          <Text>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancelInput} style={{ marginLeft: 8 }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <InputToolbar {...props}>
      <TouchableOpacity onPress={onToggleInput}>
        <Text style={{ fontSize: 18, color: "#007AFF" }}>Show Input</Text>
      </TouchableOpacity>
    </InputToolbar>
  );
};

export default ChatScreen;
