import { LecturerData } from '../types/typings.t';
import { API } from './api';

const LecturerAPI = {
  getLecturers: async () =>
    API.get('/users/lecturers?include=units.course&filter[role.slug]=lecturer'),
  createLecturer: async (lecturerNewData: LecturerData) =>
    API.post('/admin/lecturers', lecturerNewData),
  updateLecturer: async (data: {
    lecturerId: number;
    lecturerUpdateData: LecturerData;
  }) =>
    API.patch(`/admin/lecturers/${data.lecturerId}`, data.lecturerUpdateData),
  deleteLecturer: async (lecturerId: number) =>
    API.delete(`/admin/lecturers/${lecturerId}`),
};

export default LecturerAPI;
