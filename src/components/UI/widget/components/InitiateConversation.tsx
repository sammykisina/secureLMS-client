import { CreateConversation, Icon, WidgetHeader } from '@/components';
import { conversationAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';
import { useAuth, useConversation, useLecturer, useStudent } from '@/hooks';
import { appUtils } from '@/utils';
import { FC } from 'react';
import { APILecturer, APIStudent } from '../../../../types/typings.t';
import { HiOutlineChatBubbleBottomCenter } from 'react-icons/hi2';

const InitiateConversation = () => {
  /**
   * component states
   */
  const receiverMessageBgColors = [
    'bg-amber-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
  ];

  const senderMessageBgColors = [
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
  ];
  const setShowInitiateConversationWidget = useSetRecoilState(
    conversationAtoms.showInitiateConversationWidgetState
  );
  const { user, lecturerProfile, studentProfile } = useAuth();
  const { students } = useStudent();
  const { lecturers } = useLecturer();
  const { createConversationMutateAsync, isCreatingConversation } =
    useConversation();

  const currentLecturerStudents = students?.filter((student) => {
    return lecturerProfile?.relationships?.units?.find((unit) => {
      return (
        student?.relationships?.course?.id === unit?.relationships?.course?.id
      );
    });
  });

  const currentStudentLecturers = lecturers?.filter((lecturer) => {
    return lecturer?.relationships?.units?.find((unit) => {
      return (
        unit?.relationships?.course?.id ===
        studentProfile?.relationships?.course?.id
      );
    });
  });

  /**
   * component functions
   */

  const ParticipantInfo: FC<{ participant: APIStudent | APILecturer }> = () => {
    return <div></div>;
  };

  return (
    <section>
      <WidgetHeader
        close={() => setShowInitiateConversationWidget(false)}
        title={
          user?.role === 'lecturer' ? 'SELECT A STUDENT' : 'SELECT A LECTURER'
        }
      />

      {/* the conversation participants */}
      <div className='max-h-[30rem]  overflow-y-scroll scrollbar-hide flex flex-col gap-2 px-2 mt-2'>
        {user?.role === 'lecturer'
          ? currentLecturerStudents?.map((student, studentIndex) => (
              <div
                key={studentIndex}
                className='flex items-center gap-2 border p-2 rounded-md'
              >
                {/* avatar */}
                <img
                  src={appUtils.generateAvatar(student?.attributes?.email)}
                  alt=''
                  className='rounded-full'
                />

                {/* name & email */}
                <div className='flex flex-col flex-1'>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                      <span>{student?.attributes?.name}</span>
                      <span>{student?.attributes?.email}</span>
                    </div>

                    <CreateConversation
                      receiverId={student?.id}
                      senderId={user?.id}
                    />
                  </div>
                  <div className='rounded-full bg-callToAction/10 mt-2 px-3 py-1 text-xs flex items-center justify-center leading-loose w-full'>
                    {student?.relationships?.course?.attributes?.name}
                  </div>
                </div>
              </div>
            ))
          : currentStudentLecturers?.map((lecturer, lecturerIndex) => (
              <div
                key={lecturerIndex}
                className='flex items-center gap-2 border p-2 rounded-md'
              >
                {/* avatar */}
                <img
                  src={appUtils.generateAvatar(lecturer?.attributes?.email)}
                  alt=''
                  className='rounded-full'
                />

                {/* name & email */}
                <div className='flex flex-col flex-1'>
                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                      <span>{lecturer?.attributes?.name}</span>
                      <span>{lecturer?.attributes?.email}</span>
                    </div>

                    <CreateConversation
                      receiverId={lecturer?.id}
                      senderId={user?.id!}
                    />
                  </div>
                  <div className='flex gap-1  w-full px-2 overflow-x-scroll scrollbar-hide'>
                    {lecturer?.relationships.units?.map((unit, unitIndex) => (
                      <span
                        key={unitIndex}
                        className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'
                      >
                        {unit?.attributes?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default InitiateConversation;
