import { Button, SpinnerLoader } from '@/components';
import { useLecturer } from '@/hooks';
import { FC } from 'react';

const DeleteLecturer: FC<{ lecturerId: number }> = ({ lecturerId }) => {
  /**
   * component states
   */
  const { isDeletingLecturer, deleteLecturerMutateAsync } = useLecturer();
  return (
    <Button
      title={
        isDeletingLecturer ? <SpinnerLoader color='fill-white' /> : 'DELETE'
      }
      type='button'
      intent='danger'
      purpose={() => {
        deleteLecturerMutateAsync(lecturerId);
      }}
    />
  );
};

export default DeleteLecturer;
