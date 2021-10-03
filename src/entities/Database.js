// наследник всех событий
const { EventEmitter } = require('events');
// Доступ к файловой системе
const { existsSync } = require('fs');
// достаем имя дамп файла из конфигов
const { dbDumpFile } = require('../config');
const { writeFile } = require('../utils/fs');
// Приттифай, что тут добавить
const { prettifyJsonToString } = require('../utils/prettifyJsonToString');
const Img = require('./Img');

class Database extends EventEmitter {
  constructor() {
    super();

    this.idToImg = {};
  }

  async initFromDump() {
    if (existsSync(dbDumpFile) === false) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump.idToImg === 'object') {
      this.idToImg = {};

      for (let id in dump.idToImg) {
        const img = dump.idToImg[id];

        this.idToImg[id] = new Img(img.id, img.createdAt);
      }
    }

    // if (typeof dump.likedIds === 'object') {
    //   this.likedIds = { ...dump.likedIds };
    // }
  }

  // Добавление данных
  async insert(img, originalContent) {
    await img.saveOriginal(originalContent);

    this.idToImg[img.id] = img;

    this.emit('changed');
  }

  // Установление лайка
  // setLiked(imgId, value) {
  //   if (value === false) {
  //     delete this.likedIds[imgId];
  //   } else {
  //     this.likedIds[imgId] = true;
  //   }

  //   this.emit('changed');
  // }

  // Удаление
  async remove(imgId) {
    const imgRaw = this.idToImg[imgId];

    const img = new Img(imgRaw.id, imgRaw.createdAt);

    await img.removeOriginal();

    delete this.idToImg[imgId];
    //delete this.likedIds[imgId];

    this.emit('changed');

    return imgId;
  }

  // геттер на одно фото
  findOne(imgId) {
    const imgRaw = this.idToImg[imgId];

    if (!imgRaw) {
      return null;
    }

    const img = new Img(imgRaw.id, imgRaw.createdAt);

    return img;
  }


  // Геттер всех картинок
  find() {
    let allImgs = Object.values(this.idToImg);
    console.log(allImgs);
    // if (isLiked === true) {
    //   allImgs = allImgs.filter((img) => this.likedIds[img.id]);
    // }

    allImgs.sort((imgA, imgB) => imgB.createdAt - imgA.createdAt);

    return allImgs;
  }

  toJSON() {
    return {
      idToImg: this.idToImg 
    };
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', () => {
  writeFile(dbDumpFile, prettifyJsonToString(db.toJSON()));
});

module.exports = db;
