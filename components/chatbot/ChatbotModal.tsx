import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../context/ThemeContext';
import chatbotService from '../../lib/chatbotService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ visible, onClose }: ChatbotModalProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Gemora AI Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, visible]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      // Call the actual API
      const response = await chatbotService.askQuestion(messageText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.success
          ? response.response
          : response.error || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting. Please check your network and try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { id: '1', text: 'How to sell a gem?', icon: 'diamond-outline' },
    { id: '2', text: 'Browse marketplace', icon: 'storefront-outline' },
    { id: '3', text: 'Gem pricing guide', icon: 'pricetag-outline' },
    { id: '4', text: 'Certification info', icon: 'shield-checkmark-outline' },
  ];

  const handleQuickAction = (text: string) => {
    setInputText(text);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.botAvatar, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="sparkles" size={24} color="#fff" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Gemora AI Assistant
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.subtext }]}>
                Online
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <View
                style={[
                  styles.messageContent,
                  message.sender === 'user'
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                {message.sender === 'user' ? (
                  <Text
                    style={[
                      styles.messageText,
                      { color: '#fff' },
                    ]}
                  >
                    {message.text}
                  </Text>
                ) : (
                  <Markdown
                    style={{
                      body: { color: theme.colors.text, fontSize: 16, lineHeight: 24 },
                      heading1: { color: theme.colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
                      heading2: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
                      heading3: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
                      strong: { color: theme.colors.text, fontWeight: 'bold' },
                      em: { color: theme.colors.text, fontStyle: 'italic' },
                      bullet_list: { marginBottom: 8 },
                      ordered_list: { marginBottom: 8 },
                      list_item: { color: theme.colors.text, fontSize: 16, marginBottom: 4 },
                      code_inline: { backgroundColor: theme.colors.muted, color: theme.colors.text, paddingHorizontal: 4, borderRadius: 4, fontFamily: 'monospace' },
                      code_block: { backgroundColor: theme.colors.muted, color: theme.colors.text, padding: 12, borderRadius: 8, fontFamily: 'monospace' },
                      blockquote: { backgroundColor: theme.colors.muted, borderLeftWidth: 4, borderLeftColor: theme.colors.primary, paddingLeft: 12, paddingVertical: 8, marginBottom: 8 },
                      link: { color: theme.colors.primary },
                    }}
                  >
                    {message.text}
                  </Markdown>
                )}
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.botMessage]}>
              <View style={[styles.messageContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            </View>
          )}

          {/* Quick Actions */}
          {messages.length === 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={[styles.quickActionsTitle, { color: theme.colors.subtext }]}>
                Quick Actions
              </Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickActionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                    onPress={() => handleQuickAction(action.text)}
                  >
                    <Ionicons name={action.icon as any} size={20} color={theme.colors.primary} />
                    <Text style={[styles.quickActionText, { color: theme.colors.text }]} numberOfLines={2}>
                      {action.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.input, color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.subtext}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.muted },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  quickActionsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 26,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
