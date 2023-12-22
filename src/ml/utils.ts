import * as tfvis from '@tensorflow/tfjs-vis'
import { delimiters } from '../const.ts'


export function parseFileData(result: string) {
  const filesize = result.length
  for (const i in delimiters) {
    const length = result.split(delimiters[i]).length
    if (length != filesize && length > 1) {
      return result.split(delimiters[i])
    }
  }
}

export function splitToInt (word: string, max_len: number): number[] {
  const encode = []
  for (let i = 0; i < max_len; i++) {
    if (i < word.length) {
      const letter = word.slice(i, i + 1)
      encode.push(letter.charCodeAt(0) - 96)
    } else {
      encode.push(0)
    }
  }
  return encode
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

export function showVisor (): void {
  const visorInstance = tfvis.visor()

  visorInstance.toggle()

}
