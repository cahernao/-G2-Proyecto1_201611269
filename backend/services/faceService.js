const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const { imageToTensor } = require('../utils/imageUtils');

const EMOTIONS = ['feliz', 'sorpresa', 'neutral', 'enojado', 'asco', 'miedo', 'triste'];
let model;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel(`file://${path.join(__dirname, '../models/face-model/model.json')}`);
    console.log('Modelo de emociones faciales cargado.');
  }
}

async function predictFaceEmotion(imagePath) {
  await loadModel();

  const tensor = await imageToTensor(imagePath, 48); // Asegúrate de usar 48x48 como en el entrenamiento
  const prediction = model.predict(tensor);
  const probs = prediction.dataSync();
  const maxIndex = probs.indexOf(Math.max(...probs));

  return {
    cantidadRostros: 1,
    prediction: EMOTIONS[maxIndex],
    probabilities: EMOTIONS.map((emotion, i) => ({
      emotion,
      probability: +(probs[i] * 100).toFixed(2)
    }))
  };
}

module.exports = { predictFaceEmotion };
