import { ColumnDef, Row } from '@tanstack/react-table';
import { FC, useMemo } from 'react';
import { Button, DeleteCourse, DeleteUnit, Toasts } from '@/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import {
  APICourse,
  APIUnit,
  CourseData,
  SelectionOption,
  UnitData,
} from '../types/typings.t';
import { format } from 'date-fns';
import { SchoolAPI } from '@/api';
import { courseAtoms, unitAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';

const useSchool = () => {
  /**
   * hook states
   */
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    globalCourseState,
    isEditingCourseState,
    showCreateOrEditCourseWidgetState,
  } = courseAtoms;
  const setGlobalCourse = useSetRecoilState(globalCourseState);
  const setIsEditingCourse = useSetRecoilState(isEditingCourseState);
  const setShowCreateOrEditCourseWidget = useSetRecoilState(
    showCreateOrEditCourseWidgetState
  );

  const {
    globalUnitState,
    isEditingUnitState,
    showCreateOrEditUnitWidgetState,
  } = unitAtoms;
  const setGlobalUnit = useSetRecoilState(globalUnitState);
  const setIsEditingUnit = useSetRecoilState(isEditingUnitState);
  const setShowCreateOrEditUnitWidget = useSetRecoilState(
    showCreateOrEditUnitWidgetState
  );
  const courseColumns = useMemo<
    ColumnDef<{
      id: number;
      name: string;
      createdAt: string;
    }>[]
  >(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
      },
      {
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }) => <CourseActions row={row} />,
      },
    ],
    []
  );

  const unitColumns = useMemo<
    ColumnDef<{
      id: number;
      name: string;
      course: string;
      createdAt: string;
      course_id: string;
    }>[]
  >(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Course',
        accessorKey: 'course',
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
      },
      {
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }) => <UnitActions row={row} />,
      },
    ],
    []
  );

  /**
   * hook functions
   */
  const CourseActions: FC<{
    row: Row<{
      id: number;
      name: string;
      createdAt: string;
    }>;
  }> = ({ row }) => {
    return (
      <section className='flex gap-2'>
        <Button
          title='EDIT'
          type='button'
          intent='primary'
          purpose={() => {
            setGlobalCourse(row.original);
            setIsEditingCourse(true);
            setShowCreateOrEditCourseWidget(true);
          }}
        />

        <DeleteCourse courseId={row?.original?.id} />
      </section>
    );
  };

  const UnitActions: FC<{
    row: Row<{
      id: number;
      name: string;
      course: string;
      course_id: string;
      createdAt: string;
    }>;
  }> = ({ row }) => {
    return (
      <section className='flex gap-2'>
        <Button
          title='EDIT'
          type='button'
          intent='primary'
          purpose={() => {
            setGlobalUnit(row.original);
            setIsEditingUnit(true);
            setShowCreateOrEditUnitWidget(true);
          }}
        />

        <DeleteUnit unitId={row?.original?.id} />
      </section>
    );
  };

  const { data: courses, isLoading: isFetchingCourses } = useQuery({
    queryKey: ['courses', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === 'admin') {
        return (await SchoolAPI.getCourses()) as APICourse[];
      }

      return [];
    },
  });

  const { data: units, isLoading: isFetchingUnits } = useQuery({
    queryKey: ['units', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === 'admin' || role === 'student' || role === 'lecturer') {
        return (await SchoolAPI.getUnits()) as APIUnit[];
      }

      return [];
    },
  });

  const modifyCoursesDataForCoursesTable = (
    courses: APICourse[] | undefined
  ) => {
    let modifiedCoursesData = [] as unknown[];

    courses?.map((course) => {
      modifiedCoursesData = [
        ...modifiedCoursesData,
        {
          id: course?.id,
          name: course?.attributes?.name,
          createdAt: format(
            new Date(course?.attributes?.createdAt),
            'EE, MMM d, yyy'
          ),
        },
      ];
    });

    return modifiedCoursesData;
  };

  const generateCourseOptions = (courses: APICourse[] | undefined) => {
    let courseOptions = [] as unknown[];

    courses?.map((course) => {
      courseOptions = [
        ...courseOptions,
        {
          value: course?.id,
          name: course?.attributes?.name,
        },
      ];
    });

    return courseOptions as SelectionOption[];
  };

  const generateUnitOptions = (units: APIUnit[] | undefined) => {
    let unitOptions = [] as unknown[];

    units?.map((unit) => {
      unitOptions = [
        ...unitOptions,
        {
          value: unit?.id,
          name: unit?.attributes?.name,
        },
      ];
    });

    return unitOptions as SelectionOption[];
  };

  const generateUnitIds = (units: SelectionOption[]) => {
    let unitIds = new Set();

    units?.map((unit) => {
      unitIds.add(unit.value);
    });

    return [...unitIds.values()] as number[];
  };

  const modifyUnitsDataForUnitsTable = (units: APIUnit[] | undefined) => {
    let modifiedUnitsData = [] as unknown[];

    units?.map((unit) => {
      modifiedUnitsData = [
        ...modifiedUnitsData,
        {
          id: unit?.id,
          name: unit?.attributes?.name,
          course: unit?.relationships?.course?.attributes?.name,
          course_id: unit?.relationships?.course?.id,
          createdAt: format(
            new Date(unit?.attributes?.createdAt),
            'EE, MMM d, yyy'
          ),
        },
      ];
    });

    return modifiedUnitsData;
  };

  const { mutateAsync: createCourseMutateAsync, isLoading: isCreatingCourse } =
    useMutation({
      mutationFn: (courseNewData: CourseData) => {
        return SchoolAPI.createCourses(courseNewData);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        setShowCreateOrEditCourseWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: createUnitMutateAsync, isLoading: isCreatingUnit } =
    useMutation({
      mutationFn: (unitNewData: UnitData) => {
        return SchoolAPI.createUnit(unitNewData);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        setShowCreateOrEditUnitWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: updateCourseMutateAsync, isLoading: isUpdatingCourse } =
    useMutation({
      mutationFn: (data: {
        courseId: number;
        courseUpdateData: CourseData;
      }) => {
        return SchoolAPI.updateCourses(data);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        setIsEditingCourse(false);
        setGlobalCourse(null);
        setShowCreateOrEditCourseWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: updateUnitMutateAsync, isLoading: isUpdatingUnit } =
    useMutation({
      mutationFn: (data: { unitId: number; unitUpdateData: UnitData }) => {
        return SchoolAPI.updateUnit(data);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        setIsEditingUnit(false);
        setGlobalUnit(null);
        setShowCreateOrEditUnitWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: deleteCourseMutateAsync, isLoading: isDeletingCourse } =
    useMutation({
      mutationFn: (courseId: number) => {
        return SchoolAPI.deleteCourse(courseId);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        Toasts.successToast(data.message);
      },
    });
  const { mutateAsync: deleteUnitMutateAsync, isLoading: isDeletingUnit } =
    useMutation({
      mutationFn: (unitId: number) => {
        return SchoolAPI.deleteUnit(unitId);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['units'] });
        Toasts.successToast(data.message);
      },
    });

  return {
    modifyCoursesDataForCoursesTable,
    courses,
    isFetchingCourses,
    createCourseMutateAsync,
    isCreatingCourse,
    deleteCourseMutateAsync,
    isDeletingCourse,
    updateCourseMutateAsync,
    isUpdatingCourse,
    courseColumns,
    unitColumns,
    units,
    isFetchingUnits,
    modifyUnitsDataForUnitsTable,
    deleteUnitMutateAsync,
    isDeletingUnit,
    updateUnitMutateAsync,
    isUpdatingUnit,
    createUnitMutateAsync,
    isCreatingUnit,
    generateCourseOptions,
    generateUnitOptions,
    generateUnitIds,
  };
};

export default useSchool;
