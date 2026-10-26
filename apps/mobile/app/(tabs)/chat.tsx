import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
  toolExecuted?: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello Fahad! Your mobile executive agent is active. What would you like to plan or execute right now?",
      time: "Now",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");

    setTimeout(() => {
      let reply = "Your instruction has been acknowledged and context updated.";
      let toolExecuted: string | undefined = undefined;

      if (currentInput.toLowerCase().includes("emergency")) {
        reply = "Emergency mode activated. I have rebuilt your schedule to accommodate this window.";
        toolExecuted = "trigger_emergency";
      } else if (currentInput.toLowerCase().includes("plan")) {
        reply = "Here is your plan: 1 fixed meeting and 2 priority blocks are ready.";
        toolExecuted = "plan_my_day";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          text: reply,
          toolExecuted,
          time: "Just now",
        },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages List */}
        <ScrollView contentContainerStyle={styles.messageList}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubbleWrapper,
                m.sender === "user" ? styles.wrapperUser : styles.wrapperAgent,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  m.sender === "user" ? styles.bubbleUser : styles.bubbleAgent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.sender === "user" ? styles.textUser : styles.textAgent,
                  ]}
                >
                  {m.text}
                </Text>

                {m.toolExecuted && (
                  <View style={styles.toolBadge}>
                    <Text style={styles.toolText}>⚡ Executed: {m.toolExecuted}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.timestamp}>{m.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Command your agent..."
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up" size={20} color="#ffffff" />
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
  keyboardContainer: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  bubbleWrapper: {
    marginBottom: 14,
  },
  wrapperUser: {
    alignItems: "flex-end",
  },
  wrapperAgent: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: 2,
  },
  bubbleAgent: {
    backgroundColor: "#1e293b",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#334155",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#ffffff",
  },
  textAgent: {
    color: "#f1f5f9",
  },
  toolBadge: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  toolText: {
    color: "#34d399",
    fontSize: 11,
    fontFamily: "monospace",
  },
  timestamp: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    backgroundColor: "#0f172a",
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#090d16",
    color: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
});
