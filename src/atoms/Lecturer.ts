import { atom } from 'recoil';
import { LecturerData } from '../types/typings.t';

const showCreateOrEditLecturerWidgetState = atom({
  key: 'showCreateOrEditLecturerWidgetState',
  default: false,
});

const isEditingLecturerState = atom({
  key: 'isEditingLecturerState',
  default: false,
});

const globalLecturerState = atom<LecturerData | null>({
  key: 'globalLecturerState',
  default: null,
});

const lecturerAtoms = {
  showCreateOrEditLecturerWidgetState,
  isEditingLecturerState,
  globalLecturerState,
};

export default lecturerAtoms;
