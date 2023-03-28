import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { APIResult, APIStudent, Result, StudentData } from '../types/typings.t';
import { StudentAPI } from '@/api';
import { FC, useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button, DeleteStudent, Toasts } from '@/components';
import { studentAtoms, taskAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

const useStudent = () => {
  /**
   * component states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const studentColumns = useMemo<
    ColumnDef<{
      id: number;
      regNumber: string;
      name: string;
      email: string;
      createdAt: string;
    }>[]
  >(
    () => [
      {
        header: 'Reg Number',
        accessorKey: 'regNumber',
      },
      {
        header: 'Course',
        accessorKey: 'course',
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

  const studentResultsColumns = useMemo<
    ColumnDef<{
      points: number;
      unit: string;
      doneIn: string;
      taskCode: string;
    }>[]
  >(
    () => [
      {
        header: 'Task Code',
        accessorKey: 'taskCode',
        cell: ({ row }) => (
          <span className='rounded-full bg-amber-400/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'>
            {row.original?.taskCode}
          </span>
        ),
      },
      {
        header: 'Points',
        accessorKey: 'points',
      },
      {
        header: 'Unit',
        accessorKey: 'unit',
        cell: ({ row }) => (
          <span className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'>
            {row.original?.unit}
          </span>
        ),
      },
      {
        header: 'Done In',
        accessorKey: 'doneIn',
      },
    ],
    []
  );
  const {
    showCreateOrEditStudentWidgetState,
    globalStudentState,
    isEditingStudentState,
  } = studentAtoms;
  const setShowCreateOrEditStudentWidget = useSetRecoilState(
    showCreateOrEditStudentWidgetState
  );
  const setGlobalStudent = useSetRecoilState(globalStudentState);
  const setIsEditingStudent = useSetRecoilState(isEditingStudentState);

  const { globalTaskState } = taskAtoms;
  const setGlobalTask = useSetRecoilState(globalTaskState);

  const { showTakeTaskModalState } = studentAtoms;
  const setShowTakeTaskModal = useSetRecoilState(showTakeTaskModalState);

  /**
   * component functions
   */
  const Actions: FC<{
    row: Row<{
      regNumber: string;
      name: string;
      email: string;
      createdAt: string;
      id: number;
    }>;
  }> = ({ row }) => {
    return (
      <section className='flex gap-2'>
        <Button
          title='EDIT'
          type='button'
          intent='primary'
          purpose={() => {
            setShowCreateOrEditStudentWidget(true);
            setGlobalStudent(row.original);
            setIsEditingStudent(true);
          }}
        />

        <DeleteStudent studentId={row?.original?.id} />
      </section>
    );
  };

  const { data: students, isLoading: isFetchingStudents } = useQuery({
    queryKey: ['students', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === 'admin' || role === 'lecturer') {
        return (await StudentAPI.getStudents()) as APIStudent[];
      }

      return [];
    },
  });

  const modifyStudentsDataForStudentsTable = (
    students: APIStudent[] | undefined
  ) => {
    let modifiedStudentsData = [] as unknown[];

    students?.map((student) => {
      modifiedStudentsData = [
        ...modifiedStudentsData,
        {
          regNumber: student?.attributes?.regNumber,
          id: student?.id,
          name: student?.attributes?.name,
          email: student?.attributes?.email,
          course: student?.relationships?.course?.attributes?.name,
          createdAt: format(
            new Date(student?.attributes?.createdAt),
            'EE, MMM d, yyy'
          ),
        },
      ];
    });

    return modifiedStudentsData;
  };

  const generateAllDoneTaskIds = (results: APIResult[] | undefined) => {
    const allDoneTaskIds = new Set();

    results?.map((results) => {
      allDoneTaskIds.add(results?.attributes?.task_id!);
    });

    return [...allDoneTaskIds.values()] as number[];
  };

  const modifyResultsDataForResultsTable = (
    results: APIResult[] | undefined
  ) => {
    let modifiedResultsData = [] as unknown[];

    results?.map((result) => {
      modifiedResultsData = [
        ...modifiedResultsData,
        {
          taskCode: result?.relationships?.task?.attributes?.code,
          points: result?.attributes?.points,
          regNumber: result?.relationships?.student?.attributes?.regNumber,
          name: result?.relationships?.student?.attributes?.name,
          unit: result?.relationships?.task?.relationships?.unit?.attributes
            ?.name,
          doneIn: format(
            new Date(result?.attributes?.doneIn),
            'EE, MMM d, yyy'
          ),
          attemptedAt: format(
            new Date(result?.attributes?.doneIn),
            'EE, MMM d, yyy'
          ),
        },
      ];
    });

    return modifiedResultsData;
  };

  const {
    mutateAsync: createStudentMutateAsync,
    isLoading: isCreatingStudent,
  } = useMutation({
    mutationFn: (studentNewData: StudentData) => {
      return StudentAPI.createStudent(studentNewData);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowCreateOrEditStudentWidget(false);
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: createStudentTaskResultsMutateAsync,
    isLoading: isCreatingStudentTaskResult,
  } = useMutation({
    mutationFn: (studentTaskResultData: Result) => {
      return StudentAPI.createTaskResult(studentTaskResultData);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });

      setGlobalTask(null);
      localStorage.removeItem('showTakeTaskModalState');
      localStorage.removeItem('globalTask');
      localStorage.removeItem('results');
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('chosenAnswer');
      localStorage.removeItem('remainingTime');

      setShowTakeTaskModal(false);
      setShowCreateOrEditStudentWidget(false);

      navigate('/results');
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: updateStudentMutateAsync,
    isLoading: isUpdatingStudent,
  } = useMutation({
    mutationFn: (data: {
      studentId: number;
      studentUpdateData: StudentData;
    }) => {
      return StudentAPI.updateStudent(data);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowCreateOrEditStudentWidget(false);
      Toasts.successToast(data.message);
    },
  });

  const {
    mutateAsync: deleteStudentMutateAsync,
    isLoading: isDeletingStudent,
  } = useMutation({
    mutationFn: (studentId: number) => {
      return StudentAPI.deleteStudent(studentId);
    },

    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      Toasts.successToast(data.message);
    },
  });

  return {
    students,
    isFetchingStudents,
    studentColumns,
    modifyStudentsDataForStudentsTable,
    createStudentMutateAsync,
    isCreatingStudent,
    updateStudentMutateAsync,
    isUpdatingStudent,
    isDeletingStudent,
    deleteStudentMutateAsync,
    createStudentTaskResultsMutateAsync,
    isCreatingStudentTaskResult,
    studentResultsColumns,
    modifyResultsDataForResultsTable,
    generateAllDoneTaskIds,
  };
};

export default useStudent;
