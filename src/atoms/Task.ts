import { atom } from 'recoil';
import { APITask } from '../types/typings.t';

const showCreateOrEditTaskWidgetState = atom({
  key: 'showCreateOrEditTaskWidgetState',
  default: false,
});

const showTaskQnsWidgetState = atom({
  key: 'showTaskQnsWidgetState',
  default: false,
});

const showCreateOrEditTaskQnWidgetState = atom({
  key: 'showCreateOrEditTaskQnWidgetState',
  default: false,
});

const isEditingTaskQnState = atom({
  key: 'isEditingTaskQnState',
  default: false,
});

const isEditingTaskState = atom({
  key: 'isEditingTaskState',
  default: false,
});

const globalTaskState = atom<APITask | null>({
  key: 'globalTaskState',
  default: localStorage.getItem('globalTask')
    ? JSON.parse(localStorage.getItem('globalTask')!)
    : null,
});

const globalTaskQNState = atom<null>({
  key: 'globalTaskQNState',
  default: null,
});

const taskAtoms = {
  showCreateOrEditTaskWidgetState,
  isEditingTaskState,
  globalTaskState,
  showTaskQnsWidgetState,
  isEditingTaskQnState,
  showCreateOrEditTaskQnWidgetState,
  globalTaskQNState,
};

export default taskAtoms;
