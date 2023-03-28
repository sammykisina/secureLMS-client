import {
  Button,
  TabTitle,
  Widget,
  CreateOrEditCourse,
  SpinnerLoader,
  Table,
  CreateOrEditUnit,
} from '@/components';
import { courseAtoms, unitAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';
import { useSchool } from '@/hooks';

const Units = () => {
  /**
   * component states
   */
  const { showCreateOrEditUnitWidgetState } = unitAtoms;
  const [showCreateOrEditUnitWidget, setShowCreateOrEditUnitWidget] =
    useRecoilState(showCreateOrEditUnitWidgetState);
  const { units, isFetchingUnits, modifyUnitsDataForUnitsTable, unitColumns } =
    useSchool();

  return (
    <section className='h-full xs:h-[34.5rem] lg:h-[39rem]'>
      {/* title */}
      <div className='flex items-center justify-between'>
        <TabTitle title='UNITS' />

        <Button
          title='Create Unit'
          type='button'
          intent='primary'
          fullWidth={false}
          purpose={() => setShowCreateOrEditUnitWidget(true)}
        />
      </div>

      {/* the  body */}
      <section className='mt-5'>
        {isFetchingUnits ? (
          <div className='flex h-full items-center justify-center'>
            <SpinnerLoader color='fill-secondary' />
          </div>
        ) : (
          <Table
            data={modifyUnitsDataForUnitsTable(units)}
            columns={unitColumns}
            showFilters={true}
            tableHeight='h-[33.4rem] xs:h-[26.5rem] lg:h-[31.5rem]'
          />
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditUnitWidget}
        component={<CreateOrEditUnit />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Units;
