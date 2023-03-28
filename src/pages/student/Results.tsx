import React from 'react';
import { SpinnerLoader, TabTitle, Table } from '@/components';
import { useAuth, useStudent } from '@/hooks';

const Results = () => {
  /**
   * page states
   */
  const { studentResultsColumns, modifyResultsDataForResultsTable } =
    useStudent();
  const { isFetchingStudentProfile, studentProfile } = useAuth();

  return (
    <section className='h-full xs:h-[34.5rem] lg:h-[39rem]'>
      {/* title */}
      <TabTitle title='ALL YOUR RESULTS.' />

      {/* the  body */}
      <section className='mt-5'>
        {isFetchingStudentProfile ? (
          <div className='flex h-[15rem]  items-center justify-center'>
            <SpinnerLoader color='fill-callToAction' />
          </div>
        ) : (
          <Table
            data={modifyResultsDataForResultsTable(
              studentProfile?.relationships?.results!
            )}
            columns={studentResultsColumns}
            showFilters={true}
            tableHeight='h-[38.5rem] xs:h-[31rem]'
          />
        )}
      </section>
    </section>
  );
};

export default Results;
