import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { APILecturer, APIUnit, LecturerData } from '../types/typings.t';
import { LecturerAPI } from '@/api';
import { FC, useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button, DeleteLecturer, Toasts } from '@/components';
import { useSetRecoilState } from 'recoil';
import { lecturerAtoms } from '@/atoms';

const useLecturer = () => {
  /**
   * component states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const lecturerColumns = useMemo<
    ColumnDef<{
      id: number;
      workNumber: string;
      name: string;
      email: string;
      createdAt: string;
      units: APIUnit[];
    }>[]
  >(
    () => [
      {
        header: 'Work Number',
        accessorKey: 'workNumber',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Units',
        accessorKey: 'units',
        cell: ({ row }) => <LecturerUnits units={row?.original?.units} />,
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
      },
      {
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }) => <Actions row={row} />,
      },
    ],
    []
  );

  const taskRankingColumns = useMemo<
    ColumnDef<{
      regNumber: string;
      name: string;
      points: number;
      attemptedAt: string;
    }>[]
  >(
    () => [
      {
        header: 'Reg Number',
        accessorKey: 'regNumber',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Points',
        accessorKey: 'points',
      },
      {
        header: 'Attempted At',
        accessorKey: 'attemptedAt',
      },
    ],
    []
  );
  const {
    globalLecturerState,
    isEditingLecturerState,
    showCreateOrEditLecturerWidgetState,
  } = lecturerAtoms;
  const setShowCreateOrEditLecturerWidget = useSetRecoilState(
    showCreateOrEditLecturerWidgetState
  );
  const setGlobalLecturer = useSetRecoilState(globalLecturerState);
  const setIsEditingLecturer = useSetRecoilState(isEditingLecturerState);

  /**
   * component functions
   */
  const Actions: FC<{
    row: Row<{
      id: number;
      workNumber: string;
      name: string;
      email: string;
      createdAt: string;
      units: APIUnit[];
    }>;
  }> = ({ row }) => {
    return (
      <section className='flex gap-2'>
        <Button
          title='EDIT'
          type='button'
          intent='primary'
          purpose={() => {
            setIsEditingLecturer(true);
            setGlobalLecturer(row.original);
            setShowCreateOrEditLecturerWidget(true);
          }}
        />

        <DeleteLecturer lecturerId={row?.original?.id} />
      </section>
    );
  };

  const LecturerUnits: FC<{ units: APIUnit[] }> = ({ units }) => {
    return (
      <section className='flex gap-2'>
        {units?.map((unit, unitIndex) => (
          <span
            className='bg-callToAction/10 py-1 px-2 rounded-full text-textColor'
            key={unitIndex}
          >
            {unit?.attributes?.name}
          </span>
        ))}
      </section>
    );
  };

  const { data: lecturers, isLoading: isFetchingLecturers } = useQuery({
    queryKey: ['lecturers', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === 'admin' || role === 'student') {
        return (await LecturerAPI.getLecturers()) as APILecturer[];
      }

      return [];
    },
  });

  const modifyLecturersDataForLecturersTable = (
    lecturers: APILecturer[] | undefined
  ) => {
    let modifiedLecturersData = [] as unknown[];

    lecturers?.map((lecturer) => {
      modifiedLecturersData = [
        ...modifiedLecturersData,
        {
          workNumber: lecturer?.attributes?.workNumber,
          id: lecturer?.id,
          name: lecturer?.attributes?.name,
          email: lecturer?.attributes?.email,
          units: lecturer?.relationships?.units,
          createdAt: format(
            new Date(lecturer?.attributes?.createdAt),
            'EE, MMM d, yyy'
          ),
        },
      ];
    });

    return modifiedLecturersData;
  };

  const {
    mutateAsync: createLecturerMutateAsync,
    isLoading: isCreatingLecturer,
  } = useMutation({
    mutationFn: (lecturerNewData: LecturerData) => {
      return LecturerAPI.createLecturer(lecturerNewData);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['lecturers'] });
      setShowCreateOrEditLecturerWidget(false);
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: updateLecturerMutateAsync,
    isLoading: isUpdatingLecturer,
  } = useMutation({
    mutationFn: (data: {
      lecturerId: number;
      lecturerUpdateData: LecturerData;
    }) => {
      return LecturerAPI.updateLecturer(data);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['lecturers'] });
      setIsEditingLecturer(false);
      setGlobalLecturer(null);
      setShowCreateOrEditLecturerWidget(false);
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: deleteLecturerMutateAsync,
    isLoading: isDeletingLecturer,
  } = useMutation({
    mutationFn: (lecturerId: number) => {
      return LecturerAPI.deleteLecturer(lecturerId);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['lecturers'] });
      Toasts.successToast(data.message);
    },
  });

  return {
    lecturers,
    isFetchingLecturers,
    isCreatingLecturer,
    createLecturerMutateAsync,
    isUpdatingLecturer,
    updateLecturerMutateAsync,
    isDeletingLecturer,
    deleteLecturerMutateAsync,
    modifyLecturersDataForLecturersTable,
    lecturerColumns,
    taskRankingColumns,
  };
};

export default useLecturer;
