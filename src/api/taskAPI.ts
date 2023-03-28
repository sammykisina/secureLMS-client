import { QN, TaskData } from '../types/typings.t';
import { API } from './api';

const TaskAPI = {
  getTasks: async () =>
    API.get('/student/tasks?include=unit,questions.answers'),

  createTask: async (taskNewData: TaskData) =>
    API.post('/lecturer/tasks', taskNewData),

  updateTask: async (data: { taskId: number; taskUpdateData: TaskData }) =>
    API.patch(`/lecturer/tasks/${data.taskId}`, data.taskUpdateData),

  deleteTask: async (taskId: number) => API.delete(`/lecturer/tasks/${taskId}`),

  createTaskQuestion: async (data: QN) =>
    API.post('/lecturer/tasks/questions', data),

  updateTaskQuestion: async (data: {
    taskQnId: number;
    taskQnUpdateData: QN;
  }) => API.patch(``, data),
};

export default TaskAPI;
