const path = require('path');

const dbFolder = path.resolve(__dirname, '../../db/');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const imgFolder = path.resolve(dbFolder, 'img');

module.exports = {
  PORT: 8085,

  dbFolder,
  imgFolder,
  dbDumpFile,
};
