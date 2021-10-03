const path = require('path');

const { imgFolder } = require('../config');
const fs = require('../utils/fs');
const { writeFile, removeFile } = require('../utils/fs');
//const { generateId } = require('../utils/generateId');

module.exports = class Img {
  constructor(id, size, mimeType) {
    // где interface File {
    //   id: string
    //   uploadedAt: number
    //   size: number
    //   body: Buffer
    //   mimeType?: string
    // }
    this.id = id ;
    this.createdAt = '' || Date.now();
    this.size = size;
    this.originalFilename =  id /*`${this.id}_original.jpeg`*/;
    this.mimeType = mimeType;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(imgFolder, this.originalFilename), content);
    await fs.rename(content.path, path.resolve(imgFolder, this.originalFilename));
  }

  async removeOriginal() {
    await removeFile(path.resolve(imgFolder, this.originalFilename));
  }

  toPublicJSON() {
    return {
      id: this.id,
      originalUrl: path.resolve(imgFolder, this.originalFilename),
      createdAt: this.createdAt,
      size: this.size,
      //originalFilename: this.id,
      mimeType: this.mimeType
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      size: this.size,
      //this.originalFilename = `${this.id}_original.jpeg`;
      mimeType: this.mimeType
    };
  }
};
