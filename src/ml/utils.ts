import {delimiters} from '../const.ts'
import * as tf from '@tensorflow/tfjs';

export function parseFileData(result: string): string[] {
  const filesize = result.length
  let words: string[] = [];
  for (const i in delimiters) {
    const length = result.split(delimiters[i]).length
    if (length != filesize && length > 1) {
      words = result.split(delimiters[i])
    }
  }
  const cleanedWords = words
    .map(word => {
      // Convert to lowercase
      word = word.toLowerCase();
      // Remove empty and whitespace-only words
      word = word.trim();
      // Remove unwanted characters
      word = word.replace(/[^a-zA-Z0-9-_]/g, '')
      // Return word
      return word
    }) // Remove unwanted characters
    .filter(word => word.trim() !== ''); // Remove empty and whitespace-only words

  // Remove duplicates by converting to a Set and back to an array
  return Array.from(new Set(cleanedWords));
}

export function recomposeWord (word: number[], max_len: number): string[] {
  const decode: string[] = []
  for (let i = 0; i < max_len; i++) {
    if (word[i] == 0) {
      decode.push('')
    } else {
      decode.push(String.fromCharCode(word[i] + 96))
    }
  }
  return decode
}

export function cosineSimilarity(matrixA: tf.Tensor2D, matrixB: tf.Tensor2D): tf.Tensor1D {
  const normalizedA = matrixA.div(matrixA.norm('euclidean', 1));
  const normalizedB = matrixB.div(matrixB.norm('euclidean', 1));
  return tf.matMul(normalizedA, normalizedB, false, true).as1D();
}
