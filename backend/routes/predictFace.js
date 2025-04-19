const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { predictFaceEmotion } = require('../services/faceService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await predictFaceEmotion(req.file.path);
    fs.unlinkSync(req.file.path); // Elimina la imagen temporal

    res.json(result);
  } catch (error) {
    console.error('Error en /predict-face:', error);
    res.status(500).json({ error: 'No se pudo procesar la imagen.' });
  }
});

module.exports = router;
