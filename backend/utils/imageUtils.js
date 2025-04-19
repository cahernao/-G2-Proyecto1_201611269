const tf = require('@tensorflow/tfjs-node');

async function imageToTensor(filePath) {
  const imageBuffer = require('fs').readFileSync(filePath);
  return tf.node.decodeImage(imageBuffer, 1) // canal 1 = escala de grises
    .resizeNearestNeighbor([28, 28])
    .toFloat()
    .div(255.0)
    .expandDims(); // [1, 28, 28, 1]
}

module.exports = { imageToTensor };
