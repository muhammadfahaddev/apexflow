import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMobileStore } from "../../lib/store/useMobileStore";

export default function ChatScreen() {
  const { messages, isThinking, sendChatMessage } = useMobileStore();
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText("");
    await sendChatMessage(text);
  };

  const quickPrompts = [
    "Plan my day",
    "Add task: Client proposal due 5 PM",
    "I have a 2-hour emergency",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages Feed */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            const isUser = item.sender === "user";
            return (
              <View
                key={item.id}
                style={[styles.messageRow, isUser ? styles.userRow : styles.agentRow]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.agentBubble,
                  ]}
                >
                  <Text style={[styles.messageText, isUser ? styles.userText : styles.agentText]}>
                    {item.text}
                  </Text>

                  {item.toolExecuted && (
                    <View style={styles.toolTag}>
                      <Text style={styles.toolTagText}>⚡ Executed: {item.toolExecuted}</Text>
                    </View>
                  )}

                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
            );
          })}

          {isThinking && (
            <View style={[styles.messageRow, styles.agentRow]}>
              <View style={[styles.messageBubble, styles.agentBubble]}>
                <Text style={styles.agentText}>⚡ ApexFlow is optimizing your schedule...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {quickPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={styles.suggestionChip}
                onPress={() => handleSend(prompt)}
              >
                <Text style={styles.suggestionText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Command your agent..."
            placeholderTextColor="#64748b"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isThinking) && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isThinking}
          >
            <Ionicons name="arrow-up" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090d16",
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  agentRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#ffffff",
  },
  agentText: {
    color: "#f1f5f9",
  },
  toolTag: {
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignSelf: "flex-start",
  },
  toolTagText: {
    fontSize: 10,
    color: "#10b981",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 10,
    color: "#64748b",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    backgroundColor: "#090d16",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  suggestionText: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#090d16",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#f8fafc",
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
