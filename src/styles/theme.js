const media = {
  desktop: 'screen and (min-width: 1025px)',
  tablet: 'screen and (min-width: 768px) and (max-width: 1024px)',
  mobile: 'screen and (max-width: 767px)',
};

const flexSet = (just = 'center', align = 'center') => {
  return `display:flex;
    justify-content: ${just};
    align-items: ${align}
    `;
};

const flexColumnSet = (just = 'center', align = 'center') => {
  return `display:flex;
    flex-direction: column;
      justify-content: ${just};
      align-items: ${align}`;
};

const posCenterX = (type = 'absolute') => {
  return `
    position: ${type};
    left: 50%;
    transform: translateX(-50%);
    `;
};

const posCenterY = (type = 'absolute') => {
  return `
      position: ${type};
      top: 50%;
      transform: translateY(-50%);
      `;
};

const posCenter = (type = 'absolute') => {
  return `
      position: ${type};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      `;
};

const colors = {
  mainBlue: '#4066EB',
  mainGray: '#D9D9D9',
  subGray: '#ECECEC',
  textBlack: '#404040',
};

const theme = {
  media,
  flexSet,
  flexColumnSet,
  posCenterX,
  posCenterY,
  posCenter,
  colors,
};

export default theme;
