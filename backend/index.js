const express = require('express');
const cors = require('cors');
// const multer = require('multer');
const predictNumber = require('./routes/predictNumber');
// const predictFace = require('./routes/predictFace');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// app.use('/uploads', express.static('uploads'));

app.use('/predict-number', predictNumber);
// app.use('/predict-face', predictFace);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
