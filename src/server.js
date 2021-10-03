const express = require('express');
// прописываем в конфигах порт который слушаем и папку для хранения файлов
const { PORT, imgFolder } = require('./config');
// экземпляр базы данных
const db = require('./entities/Database');
const Img = require('./entities/Img');
const multer  = require('multer');
var upload = multer({ dest: imgFolder });


const app = express();

app.use(express.json());
app.use('/files', express.static(imgFolder));


app.get('/ping', (req, res) => res.json({ ping: 'pong' }));

// GET /list  - получить список изображений в формате json (должен содержать их id, размер, дата загрузки)
app.get('/api/list', (req, res) => {
  const allImgs = db.find().map((img) => img.toPublicJSON());
  //const likedImgs = db.find(true).map((img) => img.toPublicJSON());

  return res.json({allImgs});
});

// GET /image/:id  — скачать изображение с заданным id
app.get('/api/imgs/:id', (req, res) => {
  const imgId = req.params.id;

  return res.json(db.findOne(imgId).toPublicJSON());
});

// POST /upload  — загрузка изображения (сохраняет его на диск и возвращает идентификатор сохраненного изображения)
app.post('/api/upload', upload.single('img'), async (req, res) => {
  //console.log('img '+JSON.stringify(req.file));// contains data about file fields
  //console.log('body '+JSON.stringify(req.body));//contains data about non-file field

  const imgFile = new Img('', '', size = req.file.size, mimeType = req.file.mimetype);
  res.json({ img: req.file.buffer });
  await db.insert(imgFile, req.file.buffer);
  // Возвращать только id 
  return res.json(imgFile.toPublicJSON().id); 
});

// app.put('/api/imgs/:id', (req, res) => {
//   const imgId = req.params.id;
//   const isLiked = req.body.isLiked;

//   db.setLiked(imgId, isLiked);

//   return res.json({ isLiked });
// });

// DELETE /image/:id  — удалить изображение
app.delete('/api/image/:id', async (req, res) => {
  const imgId = req.params.id;

  const id = await db.remove(imgId);

  return res.json({ id });
});

// GET /merge?front=<id>&back=<id>&color=145,54,32&threshold=5  — замена фона у изображения
// TODO: сделать
app.get('/api/merge/:params', (req, res) => {
  // const imgId = req.params.id;

  // return res.json(db.findOne(imgId).toPublicJSON());
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
