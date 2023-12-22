import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import {ALPHA_LEN, BATCHSIZE, EPOCHS, MAXLEN, setStatus} from '../const.ts'
import type {Tensor} from "@tensorflow/tfjs-core";
import type {Rank, Sequential} from "@tensorflow/tfjs";

export async function create_model (currentModel) {
  await currentModel.add(tf.layers.lstm({
    units: ALPHA_LEN * 2,
    inputShape: [MAXLEN, ALPHA_LEN],
    dropout: 0.2,
    recurrentDropout: 0.2,
    useBias: true,
    returnSequences: true,
    activation: 'relu'
  }))
  await currentModel.add(tf.layers.timeDistributed({
    layer: tf.layers.dense({
      units: ALPHA_LEN,
      dropout: 0.2,
      activation: 'softmax'
    })
  }))
  return currentModel
}

export async function trainModel (currentModel: tf.Sequential, trainFeatures: Tensor<Rank>, trainLabels: Tensor<Rank>) {
  setStatus('Training Model')
  // Prepare the model for training.
  currentModel.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['mse']
  })
  await currentModel.fit(trainFeatures, trainLabels, {
    epochs: EPOCHS,
    batchSize: BATCHSIZE,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}
