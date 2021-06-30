import { atom } from 'recoil';

export const targetsState = atom({ key: 'targetsState', default: [] });

export const boxState = atom({ key: 'boxState', default: {} });

export const ratioState = atom({ key: 'ratio', default: 1 });

export const screenState = atom({
  key: 'screen',
  default: { top: 0, left: 0 },
});
