const splitter = e => e.split('-').map(t => `#${t}`);
// .reverse();
const colours = splitter('F6F7F4-3F3142-dddeda-978C98-E74455');
// const colours = ['F1FAEE', 'A8DADC', '457B9D', '1D3557'].map(e => `#${e}`);

const palette = {
  p1CellBg: '#dc685a',
  p2CellBg: '#ecaf4f',
  cellBg: 'white',
  cellHoverBg: '#3d4250',
  boardBorder: '#594b5c',
  gameBarBg: '#594b5c', // colours[1],
  localGridBorder: colours[1],
  boardActiveOutline: 'lime',
  menuButtonBg: 'white',
  menuButtonBr: 'silver',
  header: colours[1],
  textColor: 'white',
  textColor2: colours[1],
  mainBg: colours[2],
  cellText: '#d1c4e9',
  cellHoverBackground: '#7e57c2',
};

export default palette;
// export default {
//   p1CellBg: '#dc685a',
//   p2CellBg: '#ecaf4f',
//   cellBg: '#78bec5',
//   cellHoverBg: '#3d4250',
//   boardBorder: '#673ab7',
//   gameBarBg: '#9575cd',
//   boardActiveOutline: 'lime',
//   menuButtonBg: 'hotpink',
//   menuButtonBr: 'silver',
//   textColor: 'white',
//   cellText: '#d1c4e9',
//   cellHoverBackground: '#7e57c2',
// };
