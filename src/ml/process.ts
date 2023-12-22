import { create_model, trainModel } from './model.ts'
import { filterWordlist, wordToInt, padWords, safeTrainingSize, oneHotEncode} from "./preProcess.ts";
import { oneHotDecode, intToWords} from "./postProcess.ts";

export async function train(words, SAMPLELEN, MAXLEN, ALPHA_LEN, model, setModel) {
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


export function predict(value, SAMPLELEN, MAXLEN, ALPHA_LEN, model) {
  console.log(value)
  let pred_features = []
  pred_features.push(value)
  pred_features = wordToInt(pred_features)
  pred_features = oneHotEncode(pred_features)
  let pred_labels = model.predict(pred_features)
  pred_labels = oneHotDecode(pred_labels)
  pred_labels = intToWords(pred_labels)[0]
  return pred_labels
}
