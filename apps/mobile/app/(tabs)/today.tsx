import React, { useState } from "react";
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
import type { DailyPlanItem } from "@apexflow/types";

export default function TodayScreen() {
  const [items, setItems] = useState<DailyPlanItem[]>([
    {
      id: "meeting-1",
      title: "Team Standup & Product Review",
      startTime: new Date("2026-10-26T09:30:00"),
      endTime: new Date("2026-10-26T10:15:00"),
      flexibility: "fixed",
      type: "event",
      priority: "high",
    },
    {
      id: "task-1",
      title: "Implement Task 6 (Mobile Expo Client)",
      startTime: new Date("2026-10-26T10:30:00"),
      endTime: new Date("2026-10-26T12:00:00"),
      flexibility: "flexible",
      type: "task",
      priority: "critical",
    },
    {
      id: "break-1",
      title: "Lunch & Recharge",
      startTime: new Date("2026-10-26T13:00:00"),
      endTime: new Date("2026-10-26T13:45:00"),
      flexibility: "fixed",
      type: "break",
    },
    {
      id: "task-2",
      title: "Review Client Deliverables & Feedback",
      startTime: new Date("2026-10-26T14:00:00"),
      endTime: new Date("2026-10-26T15:30:00"),
      flexibility: "flexible",
      type: "task",
      priority: "high",
    },
  ]);

  const handleTriggerEmergency = () => {
    const now = new Date();
    const emergencyEnd = new Date(now.getTime() + 120 * 60000); // 2 hours

    const remainingFlexible = items
      .filter((i) => i.flexibility === "flexible")
      .map((task, idx) => ({
        ...task,
        startTime: new Date(emergencyEnd.getTime() + (idx * 60 + 15) * 60000),
        endTime: new Date(emergencyEnd.getTime() + (idx * 60 + 60) * 60000),
      }));

    const fixedItems = items.filter((i) => i.flexibility === "fixed");

    const emergencyBlock: DailyPlanItem = {
      id: `emergency-${Date.now()}`,
      title: "🚨 Emergency Mode (2h Block)",
      startTime: now,
      endTime: emergencyEnd,
      flexibility: "fixed",
      type: "event",
      priority: "critical",
    };

    setItems([emergencyBlock, ...fixedItems, ...remainingFlexible].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Header Banner */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>Daily Execution Plan</Text>
          <Text style={styles.subText}>4 protected time blocks today</Text>
        </View>

        {/* Emergency Trigger */}
        <TouchableOpacity style={styles.emergencyBtn} onPress={handleTriggerEmergency}>
          <View style={styles.pulseDot} />
          <Text style={styles.emergencyBtnText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
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
    fontSize: 17,
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
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  emergencyBtnText: {
    color: "#f87171",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
});
