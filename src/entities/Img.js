const path = require('path');

const { imgFolder } = require('../config');
const { writeFile, removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class Img {
  constructor(id, createdAt) {
    // где interface File {
    //   id: string
    //   uploadedAt: number
    //   size: number
    //   body: Buffer
    //   mimeType?: string
    // }
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();

    this.originalFilename = `${this.id}_original.img`;
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
      originalUrl: `/files/${this.id}_original.img`,
      createdAt: this.createdAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
    };
  }
};
