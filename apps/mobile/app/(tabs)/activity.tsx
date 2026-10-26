import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuditLog {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "schedule" | "emergency" | "ai" | "auth";
}

export default function ActivityScreen() {
  const logs: AuditLog[] = [
    {
      id: "log-1",
      action: "Deterministic Schedule Generated",
      target: "4 execution blocks locked with 15-min buffers",
      time: "09:00 AM",
      type: "schedule",
    },
    {
      id: "log-2",
      action: "AI Router Tool Executed",
      target: "Tool: create_task ('Review Architecture & PRs')",
      time: "10:15 AM",
      type: "ai",
    },
    {
      id: "log-3",
      action: "Emergency Mode Replanner Triggered",
      target: "Flexible tasks shifted past 120m disruption window",
      time: "11:20 AM",
      type: "emergency",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Activity Log</Text>
        <Text style={styles.headerSubtitle}>Immutable audit trail of all AI agent actions</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View style={styles.timeCol}>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.actionText}>{item.action}</Text>
              <Text style={styles.targetText}>{item.target}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  logCard: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  timeCol: {
    justifyContent: "flex-start",
  },
  timeText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#6366f1",
    fontWeight: "600",
  },
  detailsCol: {
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f5f9",
    marginBottom: 4,
  },
  targetText: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 16,
  },
});
