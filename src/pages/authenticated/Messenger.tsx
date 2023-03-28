import React from 'react';
import {
  ChatBox,
  ChatList,
  Icon,
  InitiateConversation,
  TabTitle,
  Widget,
} from '@/components';
import { useAuth, useConversation } from '@/hooks';
import { TbMessagePlus } from 'react-icons/tb';
import { conversationAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';

const Messenger = () => {
  /**
   * page states
   */
  const { user } = useAuth();
  const [showInitiateConversationWidget, setShowInitiateConversationWidget] =
    useRecoilState(conversationAtoms.showInitiateConversationWidgetState);

  /**
   * page functions
   */
  return (
    <section className='flex flex-col gap-4 h-full xs:h-[40rem] lg:h-[39rem] '>
      {/* messenger into */}
      <div className='flex gap-2 bg-callToAction/5 py-2 px-2 justify-between'>
        <TabTitle
          title={`Chat Your ${
            user?.role === 'lecturer' ? 'Students' : 'Lecturers'
          }`}
        />

        <Icon
          icon={<TbMessagePlus className='icon' />}
          iconWrapperStyles='bg-callToAction p-1 rounded-full text-white'
          purpose={() => setShowInitiateConversationWidget(true)}
        />
      </div>

      {/* messenger */}
      <section className='h-[43rem] relative'>
        <ChatList />
        <ChatBox />
      </section>
      <Widget
        widgetState={showInitiateConversationWidget}
        component={<InitiateConversation />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Messenger;
