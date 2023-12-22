import * as tf from '@tensorflow/tfjs'
import {ALPHA_LEN, MAXLEN, preProcessPattern, SAMPLELEN, setStatus} from '../const.ts'
import { wordToInt } from './utils.ts'

export function filterWordlist (words) {
  setStatus('Preprocessing Data 1')
  const filtered_words = []
  for (const i in words) {
    const is_valid = preProcessPattern(MAXLEN).test(words[i])
    if (is_valid) filtered_words.push(words[i])
  }
  return filtered_words
}
export function wordToInt (words) {
  setStatus('Preprocessing Data 2')
  const int_words = []
  for (const i in words) {
    int_words.push(wordToInt(words[i], MAXLEN))
  }
  return int_words
}
export function padWords (words) {
  setStatus('Preprocessing Data 3')
  const input_data = []
  for (const x in words) {
    for (let y = SAMPLELEN + 1; y < MAXLEN + 1; y++) {
      input_data.push(words[x].slice(0, y).concat(Array(MAXLEN - y).fill(0)))
    }
  }
  return input_data
}
export function safeTrainingSize (words) {
  setStatus('Preprocessing Data 4')
  const output_data = []
  for (const x in words) {
    for (let y = SAMPLELEN + 1; y < MAXLEN + 1; y++) {
      output_data.push(words[x])
    }
  }
  return output_data
}
export function oneHotEncode (words) {
  setStatus('Preprocessing Data 5')
  return tf.oneHot(tf.tensor2d(words, [words.length, MAXLEN], 'int32'), ALPHA_LEN)
}
