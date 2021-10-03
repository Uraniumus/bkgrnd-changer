const path = require('path');

const { imgFolder } = require('../config');
const { writeFile, removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class Img {
  constructor(id, createdAt, size, mimeType) {
    // где interface File {
    //   id: string
    //   uploadedAt: number
    //   size: number
    //   body: Buffer
    //   mimeType?: string
    // }
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();
    this.size = size;
    this.originalFilename = `${this.id}_original.jpeg`;
    this.mimeType = mimeType;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(imgFolder, this.originalFilename), content);
  }

  async removeOriginal() {
    await removeFile(path.resolve(imgFolder, this.originalFilename));
  }

  toPublicJSON() {
    return {
      id: this.id,
      originalUrl: `/files/${this.id}_original.jpeg`,
      createdAt: this.createdAt,
      size: this.size,
      //this.originalFilename = `${this.id}_original.jpeg`;
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
