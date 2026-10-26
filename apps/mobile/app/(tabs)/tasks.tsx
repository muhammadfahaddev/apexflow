import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TaskItem {
  id: string;
  title: string;
  priority: "critical" | "high" | "normal" | "low";
  durationMins: number;
  status: "pending" | "completed";
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "t-1",
      title: "Review ApexFlow Architecture & PRs",
      priority: "critical",
      durationMins: 75,
      status: "pending",
    },
    {
      id: "t-2",
      title: "Draft Client Executive Proposal",
      priority: "high",
      durationMins: 90,
      status: "pending",
    },
    {
      id: "t-3",
      title: "Update API Provider settings & models",
      priority: "normal",
      durationMins: 30,
      status: "pending",
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Inbox & Execution</Text>
        <Text style={styles.headerSubtitle}>
          Ranked by 8-factor Dynamic Priority Engine
        </Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isDone = item.status === "completed";
          return (
            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              activeOpacity={0.8}
              style={[styles.taskCard, isDone && styles.taskCardDone]}
            >
              <View style={styles.checkbox}>
                {isDone && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.badge, styles[item.priority]]}>
                    {item.priority.toUpperCase()}
                  </Text>
                  <Text style={styles.durationText}>{item.durationMins} mins</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
  },
  taskCardDone: {
    opacity: 0.5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  checkmark: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "bold",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  critical: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
  },
  high: {
    backgroundColor: "rgba(249, 115, 22, 0.2)",
    color: "#f97316",
  },
  normal: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    color: "#818cf8",
  },
  low: {
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    color: "#94a3b8",
  },
  durationText: {
    fontSize: 11,
    color: "#64748b",
    fontFamily: "monospace",
  },
});
