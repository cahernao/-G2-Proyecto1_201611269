const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const { imageToTensor } = require('../utils/imageUtils');

let model;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel(`file://${path.join(__dirname, '../models/number-model/model.json')}`);
    console.log('Modelo de números cargado.');
  }
}

async function predictNumber(imagePath) {
  await loadModel();
  const tensor = await imageToTensor(imagePath);
  const prediction = model.predict(tensor);
  const probs = prediction.dataSync();
  const maxIndex = probs.indexOf(Math.max(...probs));

  return {
    prediction: maxIndex,
    probabilities: Array.from(probs).map((p, i) => ({
      number: i,
      probability: +(p * 100).toFixed(2)
    }))
  };
}

module.exports = { predictNumber };
