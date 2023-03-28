import { useAuth, useClickOutside, useConversation } from '@/hooks';
import { useRecoilState } from 'recoil';
import { conversationAtoms } from '@/atoms';
import { appUtils } from '@/utils';
import { FC, useRef } from 'react';
import { SpinnerLoader } from '@/components';
import { APIConversation } from '../../../types/typings.t';

const ChatList = () => {
  /**
   * component states
   */
  const auth = useAuth();
  const chatListRef = useRef(null);
  const {
    conversations,
    isFetchingConversations,
    isUpdatingUnreadMessagesToRead,
    updateUnreadMessagesToReadMutateAsync,
    generateUnreadMessagesIds,
  } = useConversation();
  const [showChatList, setShowChatList] = useRecoilState(
    conversationAtoms.showChatListState
  );
  const [globalConversation, setGlobalConversation] = useRecoilState(
    conversationAtoms.globalConversationState
  );

  /**
   * component functions
   */
  useClickOutside(chatListRef, () => setShowChatList(false));

  const Conversation: FC<{
    conversation: APIConversation;
  }> = ({ conversation }) => {
    /**
     * component states
     */
    const messageCurrentUserShouldReceiver =
      conversation?.relationships?.messages?.filter(
        (message) => message?.relationships?.receiver?.id === auth?.user?.id
      );
    const unreadMessages = messageCurrentUserShouldReceiver?.filter(
      (message) => !message?.attributes?.read
    );

    return (
      <div
        onClick={() => {
          setGlobalConversation(conversation);
          setShowChatList(false);
          if (unreadMessages?.length > 0) {
            updateUnreadMessagesToReadMutateAsync(
              generateUnreadMessagesIds(unreadMessages)
            );
          }
        }}
        className={`flex gap-2 border px-2 py-2 rounded-md cursor-pointer hover:bg-callToAction/10 ${
          globalConversation && globalConversation?.id === conversation?.id
            ? 'bg-callToAction/10'
            : ''
        }`}
      >
        <img
          src={appUtils.generateAvatar(
            conversation?.relationships?.receiver?.id === auth?.user?.id!
              ? conversation?.relationships?.sender?.attributes?.name
              : conversation?.relationships?.receiver?.attributes?.name
          )}
          alt=''
          className='h-10 w-10  rounded-full'
        />

        <div className='flex-1 pr-2'>
          {/* name and last message */}
          <div className='flex items-center justify-between'>
            <span className='text-sm capitalize'>
              {conversation?.relationships?.receiver?.id === auth?.user?.id
                ? conversation?.relationships?.sender?.attributes?.name
                : conversation?.relationships?.receiver?.attributes?.name}
            </span>

            <span>
              {conversation?.relationships?.messages?.length > 0
                ? conversation?.relationships?.messages[
                    conversation?.relationships?.messages?.length - 1
                  ]?.attributes?.createdAt
                : ''}
            </span>
          </div>

          {/* current message */}
          {conversation?.relationships?.messages?.length ? (
            <div className='relative'>
              {conversation?.relationships?.messages[
                conversation?.relationships?.messages.length - 1
              ].attributes?.body?.length > 20 ? (
                <p>
                  {conversation?.relationships?.messages[
                    conversation?.relationships?.messages.length - 1
                  ].attributes?.body.substring(0, 15)}{' '}
                  ...
                </p>
              ) : (
                <p>
                  {
                    conversation?.relationships?.messages[
                      conversation?.relationships?.messages.length - 1
                    ].attributes?.body
                  }
                </p>
              )}

              {unreadMessages.length > 0 && (
                <div className='absolute bottom-0 right-0 rounded-full bg-red-500 px-2 text-xs leading-loose shadow-sm text-white'>
                  {unreadMessages?.length}
                </div>
              )}
            </div>
          ) : (
            <p className='text-sm text-textColor font-bold'>no messages yet.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={chatListRef}
      className={`h-full absolute duration-300 bg-primary border w-[15rem] rounded-l-[2rem] md:left-0 z-50 ${
        showChatList ? 'left-0' : '-left-[100%]'
      }`}
    >
      {/* header */}
      <div className='border-b p-2 h-[4rem]'>
        <img
          src={appUtils?.generateAvatar(auth?.user?.email!)}
          className='w-[3rem] h-[3rem] rounded-full'
          alt=''
        />
      </div>

      {/* conversations */}
      {isFetchingConversations ? (
        <div className=' h-[20rem] flex justify-center items-center'>
          <SpinnerLoader color='fill-callToAction' />
        </div>
      ) : conversations?.length! > 0 ? (
        <div className='flex flex-col gap-2 p-2'>
          {conversations?.map((conversation, conversationIndex) => {
            return (
              <Conversation
                key={conversationIndex}
                conversation={conversation}
              />
            );
          })}
        </div>
      ) : (
        <div className=' h-[20rem] flex justify-center items-center'>
          You have not conversations yet.
        </div>
      )}
    </section>
  );
};

export default ChatList;
