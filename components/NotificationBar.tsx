// components/NotificationBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function NotificationBar({ visible, message, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = "#00AEEF"; // tu celeste

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: "#fff",
    fontSize: 14,
  },
});