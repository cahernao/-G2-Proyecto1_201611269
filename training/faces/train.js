const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const EMOTIONS = ['feliz', 'sorpresa', 'neutral', 'enojado', 'asco', 'miedo', 'triste'];
const IMAGE_WIDTH = 48;
const IMAGE_HEIGHT = 48;
const NUM_CLASSES = EMOTIONS.length;

async function loadImages(datasetPath) {
  const images = [];
  const labels = [];

  for (let i = 0; i < EMOTIONS.length; i++) {
    const emotion = EMOTIONS[i];
    const emotionPath = path.join(datasetPath, emotion);
    const files = fs.readdirSync(emotionPath);

    for (const file of files) {
      const imgBuffer = fs.readFileSync(path.join(emotionPath, file));
      const imgTensor = tf.node.decodeImage(imgBuffer, 1)
        .resizeNearestNeighbor([IMAGE_WIDTH, IMAGE_HEIGHT])
        .toFloat()
        .div(255.0)
        .expandDims();

      images.push(imgTensor);
      labels.push(i);
    }
  }

  return {
    xs: tf.concat(images),
    ys: tf.oneHot(tf.tensor1d(labels, 'int32'), NUM_CLASSES)
  };
}

async function main() {
  const datasetPath = path.join(__dirname, 'dataset');
  const { xs, ys } = await loadImages(datasetPath);

  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 1],
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(xs, ys, {
    epochs: 20,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: tf.node.tensorBoard('./logs')
  });

  await model.save(`file://../../backend/models/face-model`);
  console.log('Modelo de expresiones faciales guardado con éxito.');
}

main();
