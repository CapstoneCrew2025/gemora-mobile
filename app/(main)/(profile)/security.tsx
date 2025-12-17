import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CreateTicketRequest, TicketPriority, ticketService } from '../../../lib/ticketService';

type PriorityOption = {
  label: string;
  value: TicketPriority;
  color: string;
};

const PRIORITY_OPTIONS: PriorityOption[] = [
  { label: 'Low', value: TicketPriority.LOW, color: '#10b981' },
  { label: 'Medium', value: TicketPriority.MEDIUM, color: '#f59e0b' },
  { label: 'High', value: TicketPriority.HIGH, color: '#ef4444' },
  { label: 'Critical', value: TicketPriority.CRITICAL, color: '#991b1b' },
];

export default function Security() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a ticket title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a ticket description');
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketData: CreateTicketRequest = {
        title: title.trim(),
        description: description.trim(),
        priority,
      };

      const response = await ticketService.createTicket(ticketData);

      Alert.alert('Success', 'Ticket created successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setTitle('');
            setDescription('');
            setPriority(TicketPriority.MEDIUM);
            // Navigate back to profile
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(main)/(profile)');
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      Alert.alert('Error', error.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPriorityOption = PRIORITY_OPTIONS.find((opt) => opt.value === priority);

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Security & Support',
          headerStyle: { backgroundColor: '#047857' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('./mytickets')}>
              <View className="flex-row items-center mr-2">
                <Ionicons name="list" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 p-4 ">
        {/* View My Tickets Button */}
        <TouchableOpacity
          onPress={() => router.push('./mytickets')}
          className="flex-row items-center justify-between p-4 mt-12 mb-4 bg-white border border-gray-400 shadow-sm rounded-2xl"
        >
          <View className="flex-row items-center flex-1 ">
            <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-emerald-100">
              <Ionicons name="list-outline" size={24} color="#047857" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-800">My Tickets</Text>
              <Text className="text-sm text-gray-600">View all your support tickets</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <View className="p-6 mb-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <View className="flex-row items-center mb-4">
            <View className="items-center justify-center w-12 h-12 mr-3 bg-blue-100 rounded-full">
              <Ionicons name="alert-circle-outline" size={24} color="#1e3a8a" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">Open Support Ticket</Text>
              <Text className="text-sm text-gray-600">Need help? Submit a support request</Text>
            </View>
          </View>
        </View>

        <View className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          {/* Title Input */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Brief description of the issue"
              className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Priority Dropdown */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">Priority</Text>
            <TouchableOpacity
              onPress={() => setShowPriorityDropdown(true)}
              className="flex-row items-center justify-between px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl"
            >
              <View className="flex-row items-center">
                <View
                  className="w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: selectedPriorityOption?.color }}
                />
                <Text className="text-base text-gray-800">{selectedPriorityOption?.label}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-700">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of your issue"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`py-4 rounded-xl ${
              isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-center text-white">Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Information Card */}
        <View className="p-4 mt-4 border border-blue-200 bg-blue-50 rounded-2xl">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#1e3a8a" className="mr-2" />
            <Text className="flex-1 ml-2 text-sm text-blue-900">
              Our support team will review your ticket and respond within 24-48 hours.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Priority Dropdown Modal */}
      <Modal
        visible={showPriorityDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityDropdown(false)}
      >
        <Pressable
          className="justify-center flex-1 px-4 bg-black/50"
          onPress={() => setShowPriorityDropdown(false)}
        >
          <View className="overflow-hidden bg-white rounded-2xl">
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">Select Priority</Text>
            </View>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setPriority(option.value);
                  setShowPriorityDropdown(false);
                }}
                className={`px-4 py-4 border-b border-gray-100 ${
                  priority === option.value ? 'bg-emerald-50' : ''
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className="w-4 h-4 mr-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <Text
                      className={`text-base ${
                        priority === option.value ? 'font-bold text-emerald-700' : 'text-gray-800'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {priority === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#047857" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
