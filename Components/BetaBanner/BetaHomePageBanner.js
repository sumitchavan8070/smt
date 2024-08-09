import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BetaHomePageBanner = ({ username }) => {
  return (
    <LinearGradient
      colors={["#4e54c8", "#8f94fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
      <Text style={styles.heading}>Dear {username},</Text>
      <Text style={styles.text}>
        This is the beta version, which will upgrade to a subscription model in
        the future.
      </Text>
      <Text style={styles.text}>
        {/* You may need to continue our service with ₹100 for 6 months in the
        future. */}
        {/* You can enjoy our service @₹99, a minimal charge for 6 months */}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "white",
    marginBottom: 8,
  },
});

export default BetaHomePageBanner;
