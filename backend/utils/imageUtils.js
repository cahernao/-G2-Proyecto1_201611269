const tf = require('@tensorflow/tfjs-node');

async function imageToTensor(filePath, size = 28) {
  const imageBuffer = require('fs').readFileSync(filePath);
  return tf.node.decodeImage(imageBuffer, 1) // escala de grises
    .resizeNearestNeighbor([size, size])
    .toFloat()
    .div(255.0)
    .expandDims(); // [1, size, size, 1]
}

module.exports = { imageToTensor };
