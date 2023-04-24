import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { ConversationAPI } from '@/api';
import {
  APIConversation,
  APIMessage,
  ConversationData,
  MessageData,
} from '../types/typings.t';
import { conversationAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';
import { Toasts } from '@/components';

const useConversation = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const setGlobalConversation = useSetRecoilState(
    conversationAtoms.globalConversationState
  );
  const setShowInitiateConversationWidget = useSetRecoilState(
    conversationAtoms.showInitiateConversationWidgetState
  );

  /**
   * hook functions
   */
  const { data: conversations, isLoading: isFetchingConversations } = useQuery({
    queryKey: ['conversations', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;
      if (role === 'lecturer' || role === 'student') {
        return (await ConversationAPI.getConversations(
          user?.id!
        )) as APIConversation[];
      }

      return [];
    },
  });

  const {
    mutateAsync: createConversationMutateAsync,
    isLoading: isCreatingConversation,
  } = useMutation({
    mutationFn: (conversationData: ConversationData) => {
      return ConversationAPI.createConversation(conversationData);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setShowInitiateConversationWidget(false);
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: createConversationMessageMutateAsync,
    isLoading: isCreatingConversationMessage,
  } = useMutation({
    mutationFn: (conversationData: MessageData) => {
      return ConversationAPI.createMessage(conversationData);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setGlobalConversation(data.conversation);
      Toasts.successToast(data.message);
    },
  });

  const generateUnreadMessagesIds = (unreadMessages: APIMessage[]) => {
    const unreadMessagesIds: number[] = [];

    unreadMessages?.map((unreadMessage) => {
      unreadMessagesIds.push(unreadMessage?.id);
    });

    return unreadMessagesIds;
  };

  const {
    mutateAsync: updateUnreadMessagesToReadMutateAsync,
    isLoading: isUpdatingUnreadMessagesToRead,
  } = useMutation({
    mutationFn: (unreadMessageIds: number[]) => {
      return ConversationAPI.updateUnreadMessagesToRead(unreadMessageIds);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    conversations,
    isFetchingConversations,
    createConversationMutateAsync,
    isCreatingConversation,
    createConversationMessageMutateAsync,
    isCreatingConversationMessage,
    generateUnreadMessagesIds,
    updateUnreadMessagesToReadMutateAsync,
    isUpdatingUnreadMessagesToRead,
  };
};

export default useConversation;
