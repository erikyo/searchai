import {MAXLEN} from "../const.ts";
import {recomposeWord} from "./utils.ts";
import {Tensor} from "@tensorflow/tfjs-core";
import {Rank} from "@tensorflow/tfjs";

export function oneHotDecode (words: Tensor<Rank>) {
  return words.argMax(-1).arraySync()
}

export function intToWords(words: string[]): string[][] {
  const results = [];
  for (const i in words){
    // @ts-ignore
    results.push(recomposeWord(words[i],MAXLEN));
  }
  return results;
}
