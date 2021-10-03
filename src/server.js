const express = require('express');
// прописываем в конфигах порт который слушаем и папку для хранения файлов
const { PORT, imgFolder } = require('./config');
// экземпляр базы данных
const db = require('./entities/Database');
const Img = require('./entities/Img');
const multer  = require('multer');
const fs = require('fs');
var upload = multer({ dest: imgFolder });

// утащить в отдельный файл
const { replaceBackground } = require('backrem');
const path = require('path');
const sizeOf = require('image-size');

const app = express();

app.use(express.json());
app.use('/files', express.static(imgFolder));


app.get('/ping', (req, res) => res.json({ ping: 'pong' }));

// GET /list  - получить список изображений в формате json (должен содержать их id, размер, дата загрузки)
app.get('/api/list', (req, res) => {
  const allImgs = db.find().map((img) => img.toPublicJSON());

  return res.json({allImgs});
});

// GET /image/:id  — скачать изображение с заданным id
app.get('/api/image/:id', (req, res) => {
  // TODO: наверное, правильно отправоять ид в базу, там отправлять в имг и возвращать стрим, который здесь пайпать
  let img = db.findOne(req.params.id).toPublicJSON();
  res.setHeader('Content-Type', img.mimeType);
  const src = fs.createReadStream(img.originalUrl);
  src.pipe(res);
  return;
});

// POST /upload  — загрузка изображения (сохраняет его на диск и возвращает идентификатор сохраненного изображения)
app.post('/api/upload', upload.single('img'), async (req, res) => {
  const imgFile = new Img(req.file.filename, size = req.file.size, mimeType = req.file.mimetype);

  await db.insert(imgFile, req.file);

  return res.json(imgFile.toPublicJSON().id); 
});

// DELETE /image/:id  — удалить изображение
app.delete('/api/image/:id', async (req, res) => {
  const imgId = req.params.id;

  const id = await db.remove(imgId);

  return res.json({ id });
});

// GET /merge?front=<id>&back=<id>&color=145,54,32&threshold=5  — замена фона у изображения [200, 50, 52]
app.get('/api/merge', (req, res) => {
  const color = req.query.color.split(',').map(Number);
  // проверить размерность файлов
  const frontUrl = db.findOne(req.query.front).toPublicJSON().originalUrl;
  const backUrl = db.findOne(req.query.back).toPublicJSON().originalUrl;
  const frontDimensions = sizeOf(frontUrl);
  const backDimensions = sizeOf(backUrl);
  if (frontDimensions.width != backDimensions.width || frontDimensions.height != backDimensions.height ){
    res.status(400).send(new Error('different pictures'));
    return;
  }
  const frontImg = fs.createReadStream(
    path.resolve(frontUrl)
  );

  const BackImg = fs.createReadStream(
    path.resolve(backUrl)
  );

  replaceBackground(frontImg, BackImg, color, req.query.threshold).then(
    (readableStream) => {
      res.setHeader('Content-Type', db.findOne(req.query.front).toPublicJSON().mimeType);
      readableStream.pipe(res);
    }
  );

  // const imgId = req.params.id;

  // return res.json(db.findOne(imgId).toPublicJSON());
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
