import { taskAtoms } from '@/atoms';
import { useSetRecoilState } from 'recoil';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { APITask, QN, TaskData } from '../types/typings.t';
import { TaskAPI } from '@/api';
import { Toasts } from '@/components';
import useAuth from './useAuth';

const useTask = () => {
  /**
   * component states
   */
  const queryClient = useQueryClient();
  const {
    globalTaskState,
    isEditingTaskState,
    showCreateOrEditTaskWidgetState,
    showCreateOrEditTaskQnWidgetState,
    globalTaskQNState,
    isEditingTaskQnState,
  } = taskAtoms;
  const setShowCreateOrEditTaskWidget = useSetRecoilState(
    showCreateOrEditTaskWidgetState
  );
  const setShowCreateOrEditTaskQnWidget = useSetRecoilState(
    showCreateOrEditTaskQnWidgetState
  );
  const setGlobalTask = useSetRecoilState(globalTaskState);
  const setIsEditingTask = useSetRecoilState(isEditingTaskState);
  const setGlobalTaskQn = useSetRecoilState(globalTaskQNState);
  const setIsEditingTaskQn = useSetRecoilState(isEditingTaskQnState);
  const { user } = useAuth();

  /**
   * component functions
   */
  const { data: tasks, isLoading: isFetchingTasks } = useQuery({
    queryKey: ['tasks', user?.role],
    queryFn: async ({ queryKey }) => {
      const [_, role] = queryKey;

      if (role === 'student') {
        return (await TaskAPI.getTasks()) as APITask[];
      }

      return [];
    },
  });

  const { mutateAsync: createTaskMutateAsync, isLoading: isCreatingTask } =
    useMutation({
      mutationFn: (taskNewData: TaskData) => {
        return TaskAPI.createTask(taskNewData);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['lecturerProfile'] });
        setShowCreateOrEditTaskWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: updateTaskMutateAsync, isLoading: isUpdatingTask } =
    useMutation({
      mutationFn: (data: { taskId: number; taskUpdateData: TaskData }) => {
        return TaskAPI.updateTask(data);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['lecturerProfile'] });
        setIsEditingTask(false);
        setGlobalTask(null);
        setShowCreateOrEditTaskWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: deleteTaskMutateAsync, isLoading: isDeletingTask } =
    useMutation({
      mutationFn: (taskId: number) => {
        return TaskAPI.deleteTask(taskId);
      },

      onSuccess: async (data) => {
        queryClient.invalidateQueries({ queryKey: ['lecturerProfile'] });
        setGlobalTask(null);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: createTaskQnMutateAsync, isLoading: isCreatingTaskQn } =
    useMutation({
      mutationFn: (data: QN) => {
        return TaskAPI.createTaskQuestion(data);
      },

      onSuccess: async (data) => {
        setGlobalTask(data.task);
        setShowCreateOrEditTaskQnWidget(false);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: updateTaskQnMutateAsync, isLoading: isUpdatingTaskQn } =
    useMutation({
      mutationFn: (data: { taskQnId: number; taskQnUpdateData: QN }) => {
        return TaskAPI.updateTaskQuestion(data);
      },

      onSuccess: async (data) => {
        setGlobalTask(data.task);
        setIsEditingTaskQn(false);
        setGlobalTaskQn(null);
        setShowCreateOrEditTaskQnWidget(false);
        Toasts.successToast(data.message);
      },
    });

  return {
    createTaskMutateAsync,
    isCreatingTask,
    updateTaskMutateAsync,
    isUpdatingTask,
    createTaskQnMutateAsync,
    isCreatingTaskQn,
    updateTaskQnMutateAsync,
    isUpdatingTaskQn,
    isDeletingTask,
    deleteTaskMutateAsync,
    isFetchingTasks,
    tasks,
  };
};

export default useTask;
