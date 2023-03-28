import { ConversationData, MessageData } from '../types/typings.t';
import { API } from './api';

const ConversationAPI = {
  getConversations: async (userId: number) =>
    API.get(`/users/conversations/${userId}`),

  createConversation: async (conversationData: ConversationData) =>
    API.post('/users/conversations/exists', conversationData),

  createMessage: async (newMessageData: MessageData) =>
    API.post(
      `/users/conversations/${newMessageData.conversation_id}/messages`,
      newMessageData
    ),
  updateUnreadMessagesToRead: async (unreadMessagesIds: number[]) =>
    API.patch('/users/conversations/messages', {
      unreadMessagesIds,
    }),
};

export default ConversationAPI;
