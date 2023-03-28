import { CourseData, UnitData } from '../types/typings.t';
import { API } from './api';

const SchoolAPI = {
  /**
   * course endpoints
   */
  getCourses: async () => API.get('/admin/courses'),
  createCourses: async (courseNewData: CourseData) =>
    API.post('/admin/courses', courseNewData),
  updateCourses: async (data: {
    courseId: number;
    courseUpdateData: CourseData;
  }) => API.patch(`/admin/courses/${data.courseId}`, data.courseUpdateData),
  deleteCourse: async (courseId: number) =>
    API.delete(`/admin/courses/${courseId}`),

  /**
   * units endpoints
   */
  getUnits: async () => API.get('/users/units?include=course'),
  createUnit: async (unitNewData: UnitData) =>
    API.post('/admin/units', unitNewData),
  updateUnit: async (data: { unitId: number; unitUpdateData: UnitData }) =>
    API.patch(`/admin/units/${data.unitId}`, data.unitUpdateData),
  deleteUnit: async (unitId: number) => API.delete(`/admin/units/${unitId}`),
};

export default SchoolAPI;
