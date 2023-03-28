import {
  Button,
  CreateOrEditStudent,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from '@/components';
import { useStudent } from '@/hooks';
import { studentAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';

const Students = () => {
  /**
   * component states
   */
  const {
    isFetchingStudents,
    students,
    studentColumns,
    modifyStudentsDataForStudentsTable,
  } = useStudent();
  const { showCreateOrEditStudentWidgetState } = studentAtoms;
  const [showCreateOrEditStudentWidget, setShowCreateOrEditStudentWidget] =
    useRecoilState(showCreateOrEditStudentWidgetState);

  /**
   * component functions
   */
  return (
    <section className='h-full xs:h-[34.5rem] lg:h-[39rem]'>
      <div className='flex items-center justify-between'>
        {/* title */}
        <TabTitle title='ALL STUDENTS' />

        <Button
          title='CREATE STUDENT'
          type='button'
          intent='primary'
          fullWidth={false}
          purpose={() => setShowCreateOrEditStudentWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className='mt-5'>
        {isFetchingStudents ? (
          <div className='flex h-[15rem]  items-center justify-center'>
            <SpinnerLoader color='fill-callToAction' />
          </div>
        ) : (
          <Table
            data={modifyStudentsDataForStudentsTable(students)}
            columns={studentColumns}
            showFilters={true}
            tableHeight='h-[38.5rem] xs:h-[31rem]'
          />
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditStudentWidget}
        component={<CreateOrEditStudent />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Students;
