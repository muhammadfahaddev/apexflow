import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { DailyPlanItem } from "@apexflow/types";

interface TimelineItemProps {
  item: DailyPlanItem;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast = false }) => {
  const isEmergency = item.title.includes("Emergency");
  const isFixed = item.flexibility === "fixed";
  const isBreak = item.type === "break";

  const formatTime = (d: Date | string) => {
    return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      {/* Time & Vertical Dot Line */}
      <View style={styles.leftColumn}>
        <Text style={styles.timeText}>{formatTime(item.startTime)}</Text>
        <View
          style={[
            styles.dot,
            isEmergency
              ? styles.dotEmergency
              : isFixed
              ? styles.dotFixed
              : isBreak
              ? styles.dotBreak
              : styles.dotDefault,
          ]}
        />
        {!isLast && <View style={styles.verticalLine} />}
      </View>

      {/* Card Content */}
      <View
        style={[
          styles.card,
          isEmergency
            ? styles.cardEmergency
            : isFixed
            ? styles.cardFixed
            : isBreak
            ? styles.cardBreak
            : styles.cardDefault,
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.endTimeText}>Until {formatTime(item.endTime)}</Text>
          <View style={styles.badgeRow}>
            {item.priority && (
              <View
                style={[
                  styles.badge,
                  item.priority === "critical"
                    ? styles.badgeCritical
                    : styles.badgeDefault,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.priority === "critical" && styles.badgeTextCritical,
                  ]}
                >
                  {item.priority}
                </Text>
              </View>
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.flexibility}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.titleText}>{item.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
  },
  leftColumn: {
    width: 65,
    alignItems: "center",
    position: "relative",
  },
  timeText: {
    color: "#94a3b8",
    fontSize: 11,
    fontFamily: "monospace",
    marginBottom: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 2,
    backgroundColor: "#090d16",
  },
  dotEmergency: {
    borderColor: "#ef4444",
    backgroundColor: "#ef4444",
  },
  dotFixed: {
    borderColor: "#6366f1",
    backgroundColor: "#6366f1",
  },
  dotBreak: {
    borderColor: "#f59e0b",
  },
  dotDefault: {
    borderColor: "#64748b",
  },
  verticalLine: {
    position: "absolute",
    top: 30,
    bottom: -20,
    width: 2,
    backgroundColor: "#1e293b",
    zIndex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginLeft: 8,
  },
  cardDefault: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
  },
  cardFixed: {
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  cardEmergency: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  cardBreak: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  endTimeText: {
    color: "#64748b",
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCritical: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  badgeText: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  badgeTextCritical: {
    color: "#f87171",
  },
  titleText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "600",
  },
});
