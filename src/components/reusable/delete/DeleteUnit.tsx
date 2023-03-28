import { Button, SpinnerLoader } from '@/components';
import { useSchool } from '@/hooks';
import { FC } from 'react';

const DeleteUnit: FC<{ unitId: number }> = ({ unitId }) => {
  /**
   * component states
   */
  const { isDeletingUnit, deleteUnitMutateAsync } = useSchool();

  return (
    <Button
      title={isDeletingUnit ? <SpinnerLoader color='fill-white' /> : 'DELETE'}
      type='button'
      intent='danger'
      purpose={() => deleteUnitMutateAsync(unitId)}
    />
  );
};

export default DeleteUnit;
