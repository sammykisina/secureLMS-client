import { atom } from 'recoil';
import { UnitData } from '../types/typings.t';

const showCreateOrEditUnitWidgetState = atom({
  key: 'showCreateOrEditUnitWidgetState',
  default: false,
});

const isEditingUnitState = atom({
  key: 'isEditingUnitState',
  default: false,
});

const globalUnitState = atom<UnitData | null>({
  key: 'globalUnitState',
  default: null,
});

const unitAtoms = {
  showCreateOrEditUnitWidgetState,
  isEditingUnitState,
  globalUnitState,
};

export default unitAtoms;
