import { useAuth, useStudent, useTask } from '@/hooks';
import { Button, Icon, SpinnerLoader } from '@/components';
import { HiOutlineTrash, HiPencil } from 'react-icons/hi2';
import { studentAtoms, taskAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';
import { FC } from 'react';
import { APITask } from '../../../../types/typings.t';

const TaskManagement: FC<{ task: APITask }> = ({ task }) => {
  /*
   * component states
   */
  const { generateAllDoneTaskIds } = useStudent();
  const { user, studentProfile } = useAuth();
  const {
    globalTaskState,
    isEditingTaskState,
    showCreateOrEditTaskWidgetState,
    showTaskQnsWidgetState,
  } = taskAtoms;
  const setShowTaskQnsWidget = useSetRecoilState(showTaskQnsWidgetState);
  const setGlobalTask = useSetRecoilState(globalTaskState);
  const setShowCreateOrEditTaskWidget = useSetRecoilState(
    showCreateOrEditTaskWidgetState
  );
  const setIsEditingTask = useSetRecoilState(isEditingTaskState);
  const { isDeletingTask, deleteTaskMutateAsync } = useTask();

  const { showTakeTaskModalState } = studentAtoms;
  const setShowTakeTaskModal = useSetRecoilState(showTakeTaskModalState);

  return (
    <div>
      {user?.role === 'lecturer' ? (
        <section className='flex flex-col gap-2'>
          <div className='px-2 flex gap-2'>
            <Icon
              iconWrapperStyles='flex items-center gap-x-2 px-6 py-3  rounded-xl text-sm w-fit border'
              icon={<HiPencil className='icon text-green-400' />}
              purpose={() => {
                setGlobalTask(task);
                setIsEditingTask(true);
                setShowCreateOrEditTaskWidget(true);
              }}
            />

            <Icon
              iconWrapperStyles='flex items-center gap-x-2 px-6 py-3  rounded-xl text-sm w-fit border border-red-500'
              icon={
                isDeletingTask ? (
                  <SpinnerLoader color='fill-callToAction' size='w-4 h-4' />
                ) : (
                  <HiOutlineTrash className='icon text-red-400' />
                )
              }
              purpose={() => deleteTaskMutateAsync(task?.id)}
            />
          </div>

          <Button
            title='VIEW QNs'
            type='button'
            intent='primary'
            purpose={() => {
              setGlobalTask(task);
              setShowTaskQnsWidget(true);
            }}
          />
        </section>
      ) : (
        <div className='p-2'>
          {generateAllDoneTaskIds(
            studentProfile?.relationships?.results
          )?.includes(task?.id) ? (
            <span className='rounded-full bg-callToAction/10 whitespace-nowrap w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'>
              Done, Check Results Page For The Your Score
            </span>
          ) : (
            <Button
              title='Take Task'
              type='button'
              intent='primary'
              purpose={() => {
                setGlobalTask(task);
                localStorage.setItem('showTakeTaskModalState', 'open');
                localStorage.setItem('globalTask', JSON.stringify(task));
                setShowTakeTaskModal(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
