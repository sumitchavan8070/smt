import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Subscription = () => {
  const handleBuySubscription = (tier) => {
    // Handle logic for buying subscription
    console.log(`Buying ${tier} subscription`);
  };

  return (
    <ScrollView
      horizontal={true}
      style={{ marginVertical: 10 }}
      showsHorizontalScrollIndicator={false}
    >
      <View style={[styles.subCardSilver]}>
        {/* <Text style={styles.cardTitle}>Silver</Text> */}
        <View style={styles.silverHeaderStrip}>
          <View style={styles.silverStrip}></View>
          <View style={styles.stripContent}>
            <Text style={styles.planTitle}>Silver Plan</Text>
            <Text style={styles.planDuration}>3 Months</Text>
          </View>
        </View>
        <Text style={styles.priceText}>₹ 99</Text>
        <Text>- Solve Unlimited PYQ</Text>
        <Text>- Solve Unlimited Test</Text>
        <Text>- Create Unlimited Test</Text>
        <Text>- Share Unlimited Test</Text>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleBuySubscription("silver")}
        >
          <LinearGradient
            colors={["#DDE1E2", "#A0A0BA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, styles.buyButton]}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={[styles.subCardGold]}>
        <View style={styles.goldHeaderStrip}>
          <View style={styles.goldStrip}></View>
          <View style={styles.stripContent}>
            <Text style={styles.planTitle}>Gold Plan</Text>
            <Text style={styles.planDuration}>6 Months</Text>
          </View>
        </View>
        <Text style={styles.priceText}>₹ 149</Text>
        <Text>- Solve Unlimited PYQ</Text>
        <Text>- Solve Unlimited Test</Text>
        <Text>- Create Unlimited Test</Text>
        <Text>- Share Unlimited Test</Text>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleBuySubscription("gold")}
        >
          <LinearGradient
            colors={["#FFD700", "#FFA500"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, styles.buyButton]}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={[styles.subCardDiamond]}>
        <View style={styles.diamondHeaderStrip}>
          <View style={styles.diamondStrip}></View>
          <View style={styles.stripContent}>
            <Text style={styles.planTitle}>Diamond Plan</Text>
            <Text style={styles.planDuration}>1 Year</Text>
          </View>
        </View>
        <Text style={styles.priceText}>₹ 249</Text>
        <Text>- Solve Unlimited PYQ</Text>
        <Text>- Solve Unlimited Test</Text>
        <Text>- Create Unlimited Test</Text>
        <Text>- Share Unlimited Test</Text>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleBuySubscription("diamond")}
        >
          <LinearGradient
            colors={["#020024", "#090979", "#00D4FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, styles.buyButton]}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  priceText: {
    fontSize: 32,
    alignSelf: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  silverHeaderStrip: {
    height: 40,
    flexDirection: "row",
    backgroundColor: "#E4E9E8",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  silverStrip: {
    height: 40,
    width: 6,
    backgroundColor: "#A0A0BA",
  },
  stripContent: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  goldHeaderStrip: {
    height: 40,
    flexDirection: "row",
    backgroundColor: "#FFD700",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  goldStrip: {
    height: 40,
    width: 6,
    backgroundColor: "#FFA500",
  },
  diamondHeaderStrip: {
    height: 40,
    flexDirection: "row",
    backgroundColor: "#c7cae6",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
  },
  diamondStrip: {
    height: 40,
    width: 6,
    backgroundColor: "#090979",
  },
  planTitle: {
    fontWeight: "bold",
    fontSize: 15,
    // color: Color.primaryColor,
  },
  planDuration: { fontSize: 12 },
  subCardSilver: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "#A0A0BA",
    borderRadius: 30,
    marginRight: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  subCardGold: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 30,
    marginRight: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  subCardDiamond: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "#00D4FF",
    borderRadius: 30,
    marginRight: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  buyButton: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Subscription;
