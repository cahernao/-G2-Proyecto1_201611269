const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;
const NUM_CLASSES = 10;

// Cargar imágenes y etiquetas (asume /0/, /1/, ... /9/)
async function loadImages(datasetPath) {
  const images = [];
  const labels = [];

  for (let i = 0; i < NUM_CLASSES; i++) {
    const classPath = path.join(datasetPath, `${i}`);
    const files = fs.readdirSync(classPath);

    for (const file of files) {
      const imageBuffer = fs.readFileSync(path.join(classPath, file));
      const imageTensor = tf.node.decodeImage(imageBuffer, 1)
        .resizeNearestNeighbor([IMAGE_WIDTH, IMAGE_HEIGHT])
        .toFloat()
        .div(255.0)
        .expandDims();

      images.push(imageTensor);
      labels.push(i);
    }
  }

  return {
    xs: tf.concat(images),
    ys: tf.oneHot(tf.tensor1d(labels, 'int32'), NUM_CLASSES),
  };
}

async function main() {
  const datasetPath = path.join(__dirname, 'dataset');
  const { xs, ys } = await loadImages(datasetPath);

  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 16,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: tf.node.tensorBoard('./logs')
  });

  await model.save(`file://../../backend/models/number-model`);
  console.log('Modelo entrenado y guardado con éxito.');
}

main();
