const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { predictNumber } = require('../services/numberService');

const router = express.Router();

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await predictNumber(req.file.path);
    fs.unlinkSync(req.file.path); // Borra imagen temporal

    res.json(result);
  } catch (error) {
    console.error('Error en /predict-number:', error);
    res.status(500).json({ error: 'Error al procesar la imagen.' });
  }
});

module.exports = router;
