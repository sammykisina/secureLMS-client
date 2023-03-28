import { FC, useState } from 'react';
import { APITask } from '../../types/typings.t';
import { Dropdown, TaskManagement } from '@/components';
import { HiOutlineEllipsisVertical } from 'react-icons/hi2';
import { format } from 'date-fns';
import { useAuth } from '@/hooks';

const Task: FC<{ task: APITask }> = ({ task }) => {
  /**
   * component states
   */
  const [showTaskManagementDropdown, setShowTaskManagementDropdown] =
    useState(false);
  const { user } = useAuth();

  return (
    <section
      className={`${task?.attributes?.bgColor} px-2 py-1 rounded-[2rem] md:w-[30rem] lg:w-[35rem] gap-2 h-[20rem]  xs:h-[15rem] flex items-center relative overflow-hidden `}
    >
      <div className='absolute top-2 left-2  rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex gap-2 items-center justify-center leading-loose text-white'>
        {task?.attributes?.code}
      </div>

      <img
        src={task?.attributes?.icon}
        className='w-[8rem] h-[8rem] rounded-full border-4'
        alt=''
      />

      <div className='flex-1'>
        <div className='absolute top-2 right-2 flex'>
          <div className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex gap-2 items-center justify-center leading-loose text-white'>
            <span> {task?.attributes?.numberOfQuestions} QNS</span> /
            <span> {task?.attributes?.timeToTakeInTask} MINS</span>
          </div>

          <Dropdown
            active={<HiOutlineEllipsisVertical className='icon' />}
            inactive={<HiOutlineEllipsisVertical className='icon' />}
            dropdownComponent={<TaskManagement task={task} />}
            displayState={showTaskManagementDropdown}
            setDisplayState={setShowTaskManagementDropdown}
          />
        </div>

        <div>
          <p className='first-letter:uppercase text-textColor'>
            {task?.attributes?.description}
          </p>

          <div className='flex flex-col gap-2'>
            <div className='flex gap-1 flex-col xs:flex-row'>
              <span className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose text-white'>
                {task?.relationships?.unit?.attributes?.name}
              </span>

              <span className='rounded-full w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose text-white'>
                {task?.attributes?.dueDate
                  ? format(
                      new Date(task?.attributes?.dueDate),
                      'EE, MMM d, yyy @ HH:mm'
                    )
                  : 'Due Date Not Set'}
              </span>
            </div>

            {user?.role === 'lecturer' ? (
              task?.attributes?.published ? (
                <p className='rounded-full bg-green-500/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose text-green-500'>
                  task is now visible to students of this unit
                </p>
              ) : (
                <p className='rounded-full bg-white/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose text-red-500'>
                  task is not visible to students yet
                </p>
              )
            ) : (
              <p className='rounded-full bg-green-500/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose text-green-500'>
                One time test. Not repeats. Take caution before you start.
              </p>
            )}
            {}
          </div>
        </div>

        <div className='absolute bottom-2 left-2  bg-white w-[5rem] h-[5rem] flex justify-center items-center rounded-full'>
          {parseInt(task?.attributes?.numberOfPointsForEachQuestion) *
            parseInt(task?.attributes?.numberOfQuestions)}{' '}
          pts
        </div>
      </div>
    </section>
  );
};

export default Task;
