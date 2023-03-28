import { atom } from 'recoil';

const forgotPasswordState = atom({
  key: 'forgotPasswordState',
  default: false,
});

const authAtoms = {
  forgotPasswordState,
};

export default authAtoms;
