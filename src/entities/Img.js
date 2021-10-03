const path = require('path');

const { imgFolder } = require('../config');
const fs = require('../utils/fs');
const { writeFile, removeFile } = require('../utils/fs');
//const { generateId } = require('../utils/generateId');

module.exports = class Img {
  constructor(id, size, mimeType) {

    this.id = id ;
    this.uploadedAt = '' || Date.now();
    this.size = size;
    this.body =  id /*`${this.id}_original.jpeg`*/;
    this.mimeType = mimeType;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(imgFolder, this.body), content);
    await fs.rename(content.path, path.resolve(imgFolder, this.body));
  }

  async removeOriginal() {
    await removeFile(path.resolve(imgFolder, this.body));
  }

  toPublicJSON() {
    return {
      id: this.id,
      originalUrl: path.resolve(imgFolder, this.body),
      uploadedAt: this.uploadedAt,
      size: this.size,
      //body: this.id,
      mimeType: this.mimeType
    };
  }

  toJSON() {
    return {
      id: this.id,
      uploadedAt: this.uploadedAt,
      size: this.size,
      //this.body = `${this.id}_original.jpeg`;
      mimeType: this.mimeType
    };
  }
};
