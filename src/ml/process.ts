import { create_model, trainModel } from './model.ts'
import { filterWordlist, wordToInt, padWords, safeTrainingSize, oneHotEncode} from "./preProcess.ts";
import { oneHotDecode, intToWords} from "./postProcess.ts";
import {Rank, Sequential} from "@tensorflow/tfjs";
import {Tensor} from "@tensorflow/tfjs-core";

export async function aiTrain(words: string[], model: Sequential, setModel: (value: (((prevState: Sequential) => Sequential) | Sequential)) => void) {
  const filtered_words = filterWordlist(words)
  const int_words = wordToInt(filtered_words)
  const train_features = padWords(int_words)
  const train_labels = safeTrainingSize(int_words)
  const trained_features = oneHotEncode(train_features)
  const trained_labels = oneHotEncode(train_labels)
  model = await create_model(model)
  setModel(model)
  model.summary()
  await trainModel(model, trained_features, trained_labels)
  await model.save('downloads://autocorrect_model')
  // memory management
  trained_features.dispose()
  trained_labels.dispose()
}

export function aiPredict(value: any, model: Sequential) {
  console.log(value)
  let pred_features: string[] = []
  pred_features.push(value)
  pred_features = wordToInt(pred_features)
  const encoded = oneHotEncode(pred_features)
  const pred_labels = model.predict(encoded)
  const decoded = oneHotDecode(pred_labels as Tensor<Rank>)
  return intToWords(decoded as unknown as string[])[0]
}
