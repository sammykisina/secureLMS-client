import { atom } from 'recoil';
import { APIConversation } from '../types/typings.t';

const showInitiateConversationWidgetState = atom({
  key: 'showInitiateConversationWidgetState',
  default: false,
});

const globalConversationState = atom<APIConversation | null>({
  key: 'globalConversationState',
  default: null,
});

const showChatListState = atom({
  key: 'showChatListState',
  default: false,
});

const conversationAtoms = {
  showInitiateConversationWidgetState,
  globalConversationState,
  showChatListState,
};

export default conversationAtoms;
