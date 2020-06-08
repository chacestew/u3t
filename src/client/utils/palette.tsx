const splitter = e => e.split('-').map(t => `#${t}`);

const colours = splitter('F6F7F4-3F3142-dddeda-978C98-E74455');

const palette = {
  p1CellBg: '#dc685a',
  p1CellBgDim: '#dc685a',
  p2CellBg: '#ecaf4f',
  p2CellBgDim: '#dc685a',
  cellBg: 'white',
  cellBgDim: 'white',
  cellHoverBg: '#594b5c', //'#3d4250',
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

export const gridSize = '580px';

export default palette;
