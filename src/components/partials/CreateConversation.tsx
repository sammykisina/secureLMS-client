import React, { FC } from 'react';
import { ConversationData } from '../../types/typings.t';
import { Icon, SpinnerLoader } from '@/components';
import { useConversation } from '@/hooks';
import { HiOutlineChatBubbleBottomCenter } from 'react-icons/hi2';

const CreateConversation: FC<ConversationData> = ({ receiverId, senderId }) => {
  /**
   * component states
   */
  const { isCreatingConversation, createConversationMutateAsync } =
    useConversation();

  return (
    <Icon
      icon={
        isCreatingConversation ? (
          <SpinnerLoader color='fill-white' size='w-4 h-4' />
        ) : (
          <HiOutlineChatBubbleBottomCenter className='icon' />
        )
      }
      iconWrapperStyles='bg-callToAction p-1 rounded-full text-white'
      purpose={() =>
        createConversationMutateAsync({
          receiverId,
          senderId,
        })
      }
    />
  );
};

export default CreateConversation;
