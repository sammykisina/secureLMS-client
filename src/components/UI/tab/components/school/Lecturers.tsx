import {
  Button,
  CreateOrEditLecturer,
  SpinnerLoader,
  TabTitle,
  Table,
  Widget,
} from '@/components';
import { useLecturer } from '@/hooks';
import { lecturerAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';

const Lecturers = () => {
  /**
   * component states
   */
  const {
    isFetchingLecturers,
    lecturers,
    modifyLecturersDataForLecturersTable,
    lecturerColumns,
  } = useLecturer();
  const { showCreateOrEditLecturerWidgetState } = lecturerAtoms;
  const [showCreateOrEditLecturerWidget, setShowCreateOrEditLecturerWidget] =
    useRecoilState(showCreateOrEditLecturerWidgetState);

  /**
   * component functions
   */
  return (
    <section className='h-full xs:h-[34.5rem] lg:h-[39rem]'>
      <div className='flex items-center justify-between'>
        {/* title */}
        <TabTitle title='ALL LECTURERS' />

        <Button
          title='CREATE LECTURER'
          type='button'
          intent='primary'
          fullWidth={false}
          purpose={() => setShowCreateOrEditLecturerWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className='mt-5'>
        {isFetchingLecturers ? (
          <div className='flex h-[15rem]  items-center justify-center'>
            <SpinnerLoader color='fill-callToAction' />
          </div>
        ) : (
          <Table
            data={modifyLecturersDataForLecturersTable(lecturers)}
            columns={lecturerColumns}
            showFilters={true}
            tableHeight='h-[33.4rem] xs:h-[26.5rem] lg:h-[31.5rem]'
          />
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditLecturerWidget}
        component={<CreateOrEditLecturer />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Lecturers;
