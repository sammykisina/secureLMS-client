import { atom } from 'recoil';

const isSidebarOpenState = atom({
  key: 'isSidebarOpenState',
  default: true,
});

const showSidebarState = atom({
  key: 'showSidebarState',
  default: false,
});

const appAtoms = {
  isSidebarOpenState,
  showSidebarState,
};

export default appAtoms;
