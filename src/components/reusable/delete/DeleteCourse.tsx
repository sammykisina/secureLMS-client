import { Button, SpinnerLoader } from '@/components';
import { useSchool } from '@/hooks';
import { FC } from 'react';

const DeleteCourse: FC<{ courseId: number }> = ({ courseId }) => {
  /**
   * component states
   */
  const { isDeletingCourse, deleteCourseMutateAsync } = useSchool();

  return (
    <Button
      title={isDeletingCourse ? <SpinnerLoader color='fill-white' /> : 'DELETE'}
      type='button'
      intent='danger'
      purpose={() => deleteCourseMutateAsync(courseId)}
    />
  );
};

export default DeleteCourse;
