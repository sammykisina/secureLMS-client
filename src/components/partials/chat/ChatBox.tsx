import { Button, Icon, Logo, SpinnerLoader } from '@/components';
import { HiBars2, HiPaperAirplane } from 'react-icons/hi2';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationAtoms } from '@/atoms';
import { appUtils } from '@/utils';
import { useAuth, useConversation } from '@/hooks';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FC } from 'react';
import { APIMessage, MessageData } from '../../../types/typings.t';

const ChatBox = () => {
  /**
   * component states
   */
  const setShowChatList = useSetRecoilState(
    conversationAtoms.showChatListState
  );
  const globalConversation = useRecoilValue(
    conversationAtoms.globalConversationState
  );
  const auth = useAuth();
  const conversation = useConversation();

  /**
   * component functions
   */
  const SendMessage = () => {
    /**
     * component states
     */
    const { register, handleSubmit, reset } = useForm<MessageData>();

    /**
     * component functions
     */
    const onSubmit: SubmitHandler<MessageData> = async ({ body }) => {
      conversation.createConversationMessageMutateAsync({
        conversation_id: globalConversation?.id!,
        receiverId:
          globalConversation?.relationships?.receiver?.id === auth?.user?.id!
            ? globalConversation?.relationships?.sender?.id!
            : globalConversation?.relationships?.receiver?.id!,

        senderId: auth?.user?.id!,
        body,
      });

      reset({
        body: '',
      });
    };

    return (
      <form
        className={`flex items-center justify-between gap-2 border-t py-2 px-1 lg:px-2`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='h-10 flex-1 rounded-full bg-callToAction/10 pl-2 pr-1'>
          <input
            className=' h-full w-full bg-transparent outline-none'
            type='text'
            {...register('body', {
              required: true,
            })}
            placeholder='Message'
          />
        </div>

        <Button
          title={
            conversation.isCreatingConversationMessage ? (
              <SpinnerLoader color='fill-white' size='h-4 w-4' />
            ) : (
              <HiPaperAirplane className='icon' />
            )
          }
          type='submit'
          fullWidth={false}
        />
      </form>
    );
  };

  const Message: FC<{ message: APIMessage }> = ({ message }) => {
    return (
      <div>
        {message?.relationships?.sender?.id === auth?.user?.id ? (
          <div className={`senderMessageContainer group flex justify-end`}>
            <div
              className={`senderMessageBody w-fit bg-secondary text-textColor`}
            >
              <div className='w-fit'>{message?.attributes?.body}</div>

              <div className='flex items-center justify-end gap-2 duration-300'>
                {/* time send */}
                <span className='rounded-full bg-textColor/10 px-3 text-xs leading-loose shadow-sm'>
                  {message.attributes?.createdAt} ago
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className='receiverMessageContainer flex justify-start'>
            <div className='receiverMessageBody bg-callToAction/10'>
              <p className='text-textColor'>{message?.attributes?.body}</p>

              <div className='flex items-center justify-end gap-2 '>
                {/* time send */}
                <span className='rounded-full bg-textColor/10 px-3 text-xs  leading-loose shadow-sm'>
                  {message.attributes?.createdAt} ago
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className='border md:border-l-0 h-full rounded-[2rem] md:ml-[15rem] md:rounded-l-none '>
      {/* header */}
      <div className='border-b p-2 h-[4rem] flex items-center gap-2'>
        <Icon
          icon={<HiBars2 className='icon' />}
          purpose={() => setShowChatList(true)}
          iconWrapperStyles='md:hidden'
        />

        {globalConversation && (
          <div className='flex flex-shrink-0 items-center gap-2'>
            <img
              src={appUtils.generateAvatar(
                globalConversation?.relationships?.receiver?.id ===
                  auth?.user?.id!
                  ? globalConversation?.relationships?.sender?.attributes?.name
                  : globalConversation?.relationships?.receiver?.attributes
                      ?.name
              )}
              alt=''
              className='h-10 w-10  rounded-full'
            />

            <span>
              {globalConversation?.relationships?.receiver?.id ===
              auth?.user?.id!
                ? globalConversation?.relationships?.sender?.attributes?.name
                : globalConversation?.relationships?.receiver?.attributes?.name}
            </span>
          </div>
        )}
      </div>

      {/* chats and send message */}
      <div>
        {globalConversation ? (
          <div className={`flex flex-1 flex-col`}>
            <div className='flex flex-col gap-3 overflow-y-scroll px-2 py-2 scrollbar-hide h-[35rem]  xs:h-[28rem]'>
              {globalConversation?.relationships?.messages.length > 0 ? (
                globalConversation?.relationships?.messages?.map(
                  (message: any, messageIndex: number) => (
                    <Message key={messageIndex} message={message} />
                  )
                )
              ) : (
                <div className='flex h-full items-center justify-center'>
                  no messages yet
                </div>
              )}
            </div>

            {/* the input */}
            <SendMessage />
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center h-[25rem]'>
            <div className='flex items-center gap-3'>
              <Logo
                logoStyles='text-[3rem] text-textColor'
                dotStyles='w-2 h-2 bg-callToAction'
              />

              <span className='text-2xl font-bold text-callToAction/50'>
                Chat
              </span>
            </div>

            <p className='mt-5 text-bold'>
              Send and receive messages with ease and secure.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatBox;
