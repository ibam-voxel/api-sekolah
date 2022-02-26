'use strict';
const debug = require('../services/debug')
debug.logHeader("loading models")

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(path.join(__dirname, '/../../config/database.js'));
debug.logData('chosen config',config);

const db = {};

const files = [];
const sortDir = (maniDir) => {
  const folders = [];
  const CheckFile = (filePath) => fs.statSync(filePath).isFile();
  const sortPath = (dir) => {
    fs.readdirSync(dir)
      .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
      .forEach((res) => {
        const filePath = path.join(dir, res);
        if (CheckFile(filePath)) {
          files.push(filePath);
        } else {
          folders.push(filePath);
        }
      });
  };
  folders.push(maniDir);
  let i = 0;
  do {
    sortPath(folders[i]);
    i += 1;
  } while (i < folders.length);
};
sortDir(__dirname);

let sequelize;

debug.logData("using config",config)

sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

files.forEach((file) => {
  const model = sequelize.import(file);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testDBConnection=async function(){
    try {
    sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    return;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return Promise.reject(error);
  }
}

//db.testDBConnection();

module.exports = db;