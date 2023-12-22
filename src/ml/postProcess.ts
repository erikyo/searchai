import {MAXLEN} from "../const.ts";
import {intToWord} from "./utils.ts";

export function oneHotDecode (words) {
  // function to decode onehot encoding
  return words.argMax(-1).arraySync()
}
export function intToWords(words){
  //function to convert int to words
  let results = [];
  for (const i in words){
    results.push(intToWord(words[i],MAXLEN));
  }
  return results;
}
