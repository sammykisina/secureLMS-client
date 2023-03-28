import {
  Button,
  TabTitle,
  Widget,
  CreateOrEditCourse,
  SpinnerLoader,
  Table,
} from '@/components';
import { courseAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';
import { useSchool } from '@/hooks';

const Courses = () => {
  /**
   * component states
   */
  const { showCreateOrEditCourseWidgetState } = courseAtoms;
  const [showCreateOrEditCourseWidget, setShowCreateOrEditCourseWidget] =
    useRecoilState(showCreateOrEditCourseWidgetState);
  const {
    courses,
    isFetchingCourses,
    modifyCoursesDataForCoursesTable,
    courseColumns,
  } = useSchool();

  return (
    <section className='h-full xs:h-[34.5rem] lg:h-[39rem]'>
      {/* title */}
      <div className='flex items-center justify-between'>
        <TabTitle title='COURSES' />

        <Button
          title='Create Course'
          type='button'
          intent='primary'
          fullWidth={false}
          purpose={() => setShowCreateOrEditCourseWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className='mt-5'>
        {isFetchingCourses ? (
          <div className='flex h-full items-center justify-center'>
            <SpinnerLoader color='fill-secondary' />
          </div>
        ) : (
          <Table
            data={modifyCoursesDataForCoursesTable(courses)}
            columns={courseColumns}
            showFilters={true}
            tableHeight='h-[33.4rem] xs:h-[26.5rem] lg:h-[31.5rem]'
          />
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditCourseWidget}
        component={<CreateOrEditCourse />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Courses;
