import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimelineItem } from "../../components/today/TimelineItem";
import { useMobileStore } from "../../lib/store/useMobileStore";

export default function TodayScreen() {
  const {
    timelineItems,
    isEmergencyActive,
    emergencyReason,
    triggerEmergency,
    clearEmergency,
    completeTask,
  } = useMobileStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Header Banner */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>Daily Execution Plan</Text>
          <Text style={styles.subText}>
            {timelineItems.length} protected blocks • 8-Factor Scheduler
          </Text>
        </View>

        {/* Emergency Trigger */}
        {isEmergencyActive ? (
          <TouchableOpacity style={styles.emergencyActiveBtn} onPress={clearEmergency}>
            <Text style={styles.emergencyActiveBtnText}>RESOLVE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emergencyBtn} onPress={() => triggerEmergency(120, "2-Hour Emergency")}>
            <View style={styles.pulseDot} />
            <Text style={styles.emergencyBtnText}>EMERGENCY</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Emergency Active Alert */}
      {isEmergencyActive && (
        <View style={styles.emergencyAlertBanner}>
          <Text style={styles.emergencyAlertText}>
            🚨 Emergency Mode Active: {emergencyReason}
          </Text>
        </View>
      )}

      {/* Timeline Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {timelineItems.map((item, index) => (
          <TimelineItem
            key={item.id || index}
            item={item}
            onComplete={() => completeTask(item.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  greetingText: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
  },
  subText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  emergencyActiveBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emergencyActiveBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  emergencyBtnText: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emergencyAlertBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(239, 68, 68, 0.4)",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  emergencyAlertText: {
    color: "#fca5a5",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
