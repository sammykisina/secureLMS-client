import { Button, SpinnerLoader } from '@/components';
import { useStudent } from '@/hooks';
import { FC } from 'react';

const DeleteStudent: FC<{ studentId: number }> = ({ studentId }) => {
  /**
   * component states
   */
  const { isDeletingStudent, deleteStudentMutateAsync } = useStudent();
  return (
    <Button
      title={
        isDeletingStudent ? <SpinnerLoader color='fill-white' /> : 'DELETE'
      }
      type='button'
      intent='danger'
      purpose={() => {
        deleteStudentMutateAsync(studentId);
      }}
    />
  );
};

export default DeleteStudent;
