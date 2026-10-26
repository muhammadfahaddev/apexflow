import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ApprovalItem {
  id: string;
  action: string;
  details: string;
  risk: "high" | "medium" | "low";
  time: string;
}

export default function InboxScreen() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: "app-1",
      action: "Send Email: Client Project Brief",
      details: "To: client@acme.com • Subject: Executive Scope Proposal",
      risk: "high",
      time: "10 mins ago",
    },
    {
      id: "app-2",
      action: "Reschedule Sync with Team",
      details: "Shift from 09:30 AM to 11:30 AM due to emergency mode",
      risk: "medium",
      time: "25 mins ago",
    },
  ]);

  const handleResolve = (id: string, approved: boolean) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Approvals Inbox</Text>
        <Text style={styles.headerSubtitle}>
          Tier 2 Autonomous Actions requiring executive sign-off
        </Text>
      </View>

      {approvals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛡️</Text>
          <Text style={styles.emptyTitle}>All Actions Cleared</Text>
          <Text style={styles.emptySubtitle}>No pending executive approvals right now.</Text>
        </View>
      ) : (
        <FlatList
          data={approvals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.actionTitle}>{item.action}</Text>
                <Text style={[styles.riskBadge, item.risk === "high" ? styles.riskHigh : styles.riskMedium]}>
                  {item.risk.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.details}>{item.details}</Text>
              <Text style={styles.time}>{item.time}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => handleResolve(item.id, false)}
                  style={styles.rejectBtn}
                >
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleResolve(item.id, true)}
                  style={styles.approveBtn}
                >
                  <Text style={styles.approveText}>Approve & Execute</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
    gap: 14,
  },
  card: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f1f5f9",
    flex: 1,
  },
  riskBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  riskHigh: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
  },
  riskMedium: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    color: "#f59e0b",
  },
  details: {
    fontSize: 13,
    color: "#cbd5e1",
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    alignItems: "center",
  },
  rejectText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  approveBtn: {
    flex: 2,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    alignItems: "center",
  },
  approveText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
});
