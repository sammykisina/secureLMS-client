const getRandom = (list: string[]) =>
  list[Math.floor(Math.random() * list.length)];

const generateTaskCode: () => string = () => {
  const loops = 4;
  let code = '';
  for (let index = 0; index <= loops; index++) {
    const number = Math.floor(Math.random() * 1000);
    code = code + number;
  }

  return 'TASK-' + generateNumberWithDashes(code);
};

const generateNumberWithDashes: (number: string) => string = (number) => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '-');
};

const generateAvatar: (name: string) => string = (name) =>
  `https://ui-avatars.com/api/?name=${name}&background=14264e&color=fff&bold=true&font-size=0.33`;

const generateCaptcha = () =>
  btoa((Math.random() * 1000000000).toString()).substring(
    0,
    5 + Math.random() * 5
  );

const generateRotateAngle = () => [
  'rotate-[2deg]',
  'rotate-[35deg]',
  'rotate-[80deg]',
  'rotate-[71deg]',
  'rotate-[10deg]',
  'rotate-[18deg]',
  'rotate-[2deg]',
  'rotate-[35deg]',
  'rotate-[80deg]',
  'rotate-[71deg]',
  'rotate-[10deg]',
  'rotate-[18deg]',
];

const appUtils = {
  getRandom,
  generateTaskCode,
  generateAvatar,
  generateCaptcha,
  generateRotateAngle,
};

export default appUtils;
