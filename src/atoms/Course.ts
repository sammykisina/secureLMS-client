import { atom } from 'recoil';
import { CourseData } from '../types/typings.t';

const showCreateOrEditCourseWidgetState = atom({
  key: 'showCreateOrEditCourseWidgetState',
  default: false,
});

const isEditingCourseState = atom({
  key: 'isEditingCourseState',
  default: false,
});

const globalCourseState = atom<CourseData | null>({
  key: 'globalCourseState',
  default: null,
});

const courseAtoms = {
  showCreateOrEditCourseWidgetState,
  isEditingCourseState,
  globalCourseState,
};

export default courseAtoms;
