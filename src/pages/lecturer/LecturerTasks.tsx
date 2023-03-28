import { useAuth } from '@/hooks';
import {
  Button,
  CreateOrEditTask,
  SpinnerLoader,
  TabTitle,
  Title,
  Task,
  Widget,
} from '@/components';
import { taskAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';

const LecturerTasks = () => {
  /**
   * page states
   */
  const { isFetchingLecturerProfile, lecturerProfile } = useAuth();
  const { showCreateOrEditTaskWidgetState } = taskAtoms;
  const [showCreateOrEditTaskWidget, setShowCreateOrEditTaskWidget] =
    useRecoilState(showCreateOrEditTaskWidgetState);

  /**
   * page functions
   */
  return (
    <section className='flex flex-col gap-4 h-full xs:h-[40rem] lg:h-[39rem]'>
      {/* lecturer units */}
      <div className='flex gap-2 bg-callToAction/5 py-2 px-2'>
        <TabTitle title='YOUR UNITS.' />

        <div className='flex gap-1  w-full px-2 overflow-x-scroll scrollbar-hide'>
          {isFetchingLecturerProfile ? (
            <SpinnerLoader color='fill-callToAction' size='w-4 h-4' />
          ) : (
            lecturerProfile?.relationships.units?.map((unit, unitIndex) => (
              <span
                key={unitIndex}
                className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'
              >
                {unit?.attributes?.name}
              </span>
            ))
          )}
        </div>
      </div>

      {/*  */}
      <div className='md:flex justify-center'>
        <div className='flex items-center justify-between md:w-[30rem] lg:w-[35rem]'>
          {/* title */}
          <Title title='Tasks' />

          <Button
            title='CREATE TASK'
            type='button'
            intent='primary'
            fullWidth={false}
            purpose={() => setShowCreateOrEditTaskWidget(true)}
          />
        </div>
      </div>

      {/* current lecturer tasks */}
      <div className='mt-5 h-[38rem] overflow-y-scroll  scrollbar-hide'>
        <div className='flex justify-center flex-col md:items-center gap-5'>
          {lecturerProfile?.relationships?.tasks?.length! > 0 ? (
            lecturerProfile?.relationships?.tasks?.map((task, taskIndex) => (
              <Task key={taskIndex} task={task} />
            ))
          ) : (
            <div className='flex h-[15rem] justify-center items-center'>
              You have no tasks created yet.
            </div>
          )}
        </div>
      </div>

      <Widget
        widgetState={showCreateOrEditTaskWidget}
        component={<CreateOrEditTask />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default LecturerTasks;
