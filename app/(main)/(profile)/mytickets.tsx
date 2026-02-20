import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ticket, TicketPriority, TicketStatus, ticketService } from '../../../lib/ticketService';

type PriorityConfig = {
  color: string;
  bgColor: string;
  label: string;
};

type StatusConfig = {
  color: string;
  bgColor: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PRIORITY_CONFIG: Record<TicketPriority, PriorityConfig> = {
  [TicketPriority.LOW]: { color: '#10b981', bgColor: '#d1fae5', label: 'Low' },
  [TicketPriority.MEDIUM]: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Medium' },
  [TicketPriority.HIGH]: { color: '#ef4444', bgColor: '#fee2e2', label: 'High' },
  [TicketPriority.CRITICAL]: { color: '#991b1b', bgColor: '#fecaca', label: 'Critical' },
};

const STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  [TicketStatus.OPEN]: {
    color: '#2563eb',
    bgColor: '#dbeafe',
    label: 'Open',
    icon: 'alert-circle',
  },
  [TicketStatus.IN_PROGRESS]: {
    color: '#f59e0b',
    bgColor: '#fef3c7',
    label: 'In Progress',
    icon: 'time',
  },
  [TicketStatus.RESOLVED]: {
    color: '#10b981',
    bgColor: '#d1fae5',
    label: 'Resolved',
    icon: 'checkmark-circle',
  },
  [TicketStatus.CLOSED]: {
    color: '#6b7280',
    bgColor: '#f3f4f6',
    label: 'Closed',
    icon: 'close-circle',
  },
};

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const data = await ticketService.getMyTickets();
      setTickets(data);
    } catch (error: any) {
      console.error('Failed to load tickets:', error);
      Alert.alert('Error', error.message || 'Failed to load tickets');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadTickets(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const renderTicketCard = (ticket: Ticket) => {
    const priorityConfig = PRIORITY_CONFIG[ticket.priority];
    const statusConfig = STATUS_CONFIG[ticket.status];

    return (
      <View
        key={ticket.id}
        className="p-4 mb-3 bg-white border border-gray-200 shadow-sm rounded-2xl"
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3 mt-">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-gray-800" numberOfLines={2}>
              {ticket.title}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">{formatDate(ticket.createdAt)}</Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusConfig.bgColor }}
          >
            <View className="flex-row items-center">
              <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
              <Text
                className="ml-1 text-xs font-semibold"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text className="mb-3 text-sm text-gray-600" numberOfLines={3}>
          {ticket.description}
        </Text>

        {/* Priority Badge */}
        <View className="flex-row items-center justify-between">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: priorityConfig.bgColor }}
          >
            <Text className="text-xs font-semibold" style={{ color: priorityConfig.color }}>
              {priorityConfig.label} Priority
            </Text>
          </View>

          {ticket.adminReply && (
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-ellipses" size={14} color="#10b981" />
              <Text className="ml-1 text-xs font-medium text-emerald-600">Reply received</Text>
            </View>
          )}
        </View>

        {/* Admin Reply */}
        {ticket.adminReply && (
          <View className="p-3 mt-3 border-l-4 bg-emerald-50 border-emerald-500 rounded-r-xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="person-circle" size={16} color="#047857" />
              <Text className="ml-1 text-xs font-bold text-emerald-800">Admin Reply</Text>
            </View>
            <Text className="text-sm text-emerald-900">{ticket.adminReply}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <Stack.Screen
          options={{
            title: 'My Tickets',
            headerStyle: { backgroundColor: '#047857' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#047857" />
          <Text className="mt-2 text-gray-600">Loading tickets...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 ">
      <Stack.Screen
        options={{
          title: 'My Tickets',
          headerStyle: { backgroundColor: '#047857' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('./security')}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        className="flex-1 p-4 mt-2"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#047857']}
            tintColor="#047857"
          />
        }
      >
        {/* Stats Card */}
        <View className="flex-row p-4 pt-4 mb-5 bg-white border border-gray-200 shadow-sm mt-11 rounded-2xl">
          <View className="items-center justify-center flex-1 border-r border-gray-200">
            <Text className="text-2xl font-bold text-emerald-600">{tickets.length}</Text>
            <Text className="text-xs text-gray-600">Total Tickets</Text>
          </View>
          <View className="items-center justify-center flex-1 border-r border-gray-200">
            <Text className="text-2xl font-bold text-blue-600">
              {tickets.filter((t) => t.status === TicketStatus.OPEN).length}
            </Text>
            <Text className="text-xs text-gray-600">Open</Text>
          </View>
          <View className="items-center justify-center flex-1">
            <Text className="text-2xl font-bold text-green-600">
              {tickets.filter((t) => t.status === TicketStatus.RESOLVED).length}
            </Text>
            <Text className="text-xs text-gray-600">Resolved</Text>
          </View>
        </View>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <View className="items-center justify-center p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
              <Ionicons name="ticket-outline" size={40} color="#9ca3af" />
            </View>
            <Text className="mb-2 text-lg font-bold text-gray-800">No Tickets Yet</Text>
            <Text className="mb-4 text-sm text-center text-gray-600">
              You haven't created any support tickets yet.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('./security')}
              className="px-6 py-3 rounded-xl bg-emerald-600"
            >
              <Text className="font-semibold text-white">Create Your First Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tickets.map((ticket) => renderTicketCard(ticket))
        )}
      </ScrollView>
    </View>
  );
}
