import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenTopBar from "../components/common/ScreenTopBar";
import { colors } from "../theme/colors";

export default function WalletScreen({ deposit, goBack, setDeposit }) {
  const [selected, setSelected] = useState(deposit);
  return (
    <View style={styles.screen}>
      <ScreenTopBar title="Amazon Now Wallet" subtitle="Emergency purchase protection" goBack={goBack} />
      <View style={styles.content}>
        <View style={styles.walletCard}>
          <View><Text style={styles.balanceLabel}>Amazon Wallet</Text><Text style={styles.balance}>₹120</Text></View>
          <MaterialCommunityIcons name="wallet-outline" size={35} color={colors.amazonOrange} />
        </View>
        <View style={styles.depositCard}>
          <View style={styles.depositIcon}><Ionicons name="shield-checkmark" size={28} color="#ffffff" /></View>
          <Text style={styles.depositLabel}>Emergency deposit balance</Text>
          <Text style={styles.depositBalance}>₹{deposit}</Text>
          <Text style={styles.depositText}>Only used for emergency purchases when your Amazon Wallet balance is insufficient.</Text>
        </View>
        <Text style={styles.title}>Choose emergency deposit</Text>
        <View style={styles.options}>
          {[500, 1000, 2000].map((amount) => (
            <Pressable key={amount} onPress={() => setSelected(amount)} style={[styles.option, selected === amount && styles.optionSelected]}>
              <Text style={[styles.optionText, selected === amount && styles.optionTextSelected]}>₹{amount}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => setDeposit(selected)} style={styles.save}><Text style={styles.saveText}>Save emergency deposit</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.skyLight, flex: 1 },
  content: { padding: 16 },
  walletCard: { alignItems: "center", backgroundColor: colors.amazonBlue, borderRadius: 8, flexDirection: "row", justifyContent: "space-between", padding: 18 },
  balanceLabel: { color: "#dbe4ee", fontSize: 13, fontWeight: "800" },
  balance: { color: "#ffffff", fontSize: 28, fontWeight: "900", marginTop: 4 },
  depositCard: { alignItems: "center", backgroundColor: "#ffffff", borderColor: "#cde6d4", borderRadius: 8, borderWidth: 1, marginTop: 14, padding: 20 },
  depositIcon: { alignItems: "center", backgroundColor: colors.green, borderRadius: 26, height: 52, justifyContent: "center", width: 52 },
  depositLabel: { color: colors.muted, fontSize: 13, fontWeight: "800", marginTop: 12 },
  depositBalance: { color: colors.green, fontSize: 31, fontWeight: "900", marginTop: 3 },
  depositText: { color: colors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 7, textAlign: "center" },
  title: { color: colors.ink, fontSize: 20, fontWeight: "900", marginTop: 22 },
  options: { flexDirection: "row", gap: 8, marginTop: 12 },
  option: { alignItems: "center", backgroundColor: "#ffffff", borderColor: colors.stroke, borderRadius: 8, borderWidth: 1, flex: 1, paddingVertical: 14 },
  optionSelected: { backgroundColor: "#e9f8ed", borderColor: colors.green },
  optionText: { color: colors.ink, fontSize: 14, fontWeight: "900" },
  optionTextSelected: { color: colors.green },
  save: { alignItems: "center", backgroundColor: colors.amazonOrange, borderRadius: 8, marginTop: 18, padding: 15 },
  saveText: { color: colors.amazonBlue, fontSize: 15, fontWeight: "900" }
});
