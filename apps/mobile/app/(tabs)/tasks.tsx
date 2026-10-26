import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMobileStore } from "../../lib/store/useMobileStore";

export default function TasksScreen() {
  const { tasks, addTask, completeTask, removeTask } = useMobileStore();
  const [newTitle, setNewTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), 45, "high");
    setNewTitle("");
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Task Inbox & Queue</Text>
            <Text style={styles.headerSubtitle}>
              {tasks.length} total tasks • Ranked by 8-factor Priority Engine
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAdd(!showAdd)}
          >
            <Text style={styles.addBtnText}>{showAdd ? "✕" : "➕"}</Text>
          </TouchableOpacity>
        </View>

        {showAdd && (
          <View style={styles.addBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter task title (e.g. Finish Q3 Report)..."
              placeholderTextColor="#64748b"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <Text style={styles.submitBtnText}>Add to Schedule</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isDone = item.status === "completed";
          return (
            <TouchableOpacity
              onPress={() => completeTask(item.id)}
              activeOpacity={0.8}
              style={[styles.taskCard, isDone && styles.taskCardDone]}
            >
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
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
                  <Text style={styles.durationText}>{item.durationMins || 45} mins</Text>
                  <Text style={styles.flexibilityText}>
                    {item.flexibility === "fixed" ? "🔒 Fixed" : "⚡ Flexible"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => removeTask(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#818cf8",
    fontSize: 14,
    fontWeight: "bold",
  },
  addBox: {
    marginTop: 12,
    gap: 8,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#f8fafc",
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
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
    opacity: 0.4,
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
  checkboxDone: {
    backgroundColor: "#6366f1",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 13,
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
  flexibilityText: {
    fontSize: 10,
    color: "#94a3b8",
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    color: "#64748b",
    fontSize: 13,
  },
});
