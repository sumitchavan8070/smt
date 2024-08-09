import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Bubble } from "react-native-gifted-chat";

const CustomMessage = ({ currentMessage }) => {
  const { testPaperID, paperName, totalQuestions } = currentMessage;

  // Handle button click here (replace with your logic)
  const handleOneAttemptPaperButton = () => {
    console.log(
      "One Attempt Paper Button clicked for message:",
      currentMessage
    );
    // Perform actions based on testPaperID or other message data
  };

  return (
    <Bubble
      {...currentMessage}
      wrapperStyle={
        {
          // Customize bubble styles as needed
        }
      }
    >
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{currentMessage.text}</Text>
        {testPaperID && paperName && totalQuestions && (
          <View style={styles.paperDetails}>
            <Text style={styles.paperDetailsText}>Paper ID: {testPaperID}</Text>
            <Text style={styles.paperDetailsText}>{paperName}</Text>
            <Text style={styles.paperDetailsText}>
              Total Questions: {totalQuestions}
            </Text>
            <Button
              title="One Attempt Paper"
              onPress={handleOneAttemptPaperButton}
              style={styles.button}
            />
          </View>
        )}
      </View>
    </Bubble>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  messageText: {
    // Customize message text styles
  },
  paperDetails: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  paperDetailsText: {
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
  },
});

export default CustomMessage;
