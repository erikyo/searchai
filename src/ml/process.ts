import * as USE from "universal-sentence-encoder-alt";
import { cosineSimilarity } from './utils';

export async function aiPredict(value: string, words: string[], model: USE.UniversalSentenceEncoder, threshold = 0.7) {
  // Split the value into words
  const valueWords = value.split(' ');

  let totalGoodMatches = [];

  for (const valueWord of valueWords) {
    // Filter words to reduce the number to process
    const startingLetter = valueWord.charAt(0);
    const filteredWords = words.filter(word => word.startsWith(startingLetter));

    const embeddings = await model.embed([valueWord, ...filteredWords]);
    const valueEmbedding = embeddings.slice(0, 1);
    const goodMatches = [];

    // Store word embeddings to avoid slicing multiple times
    const wordEmbeddings = [];
    for (let i = 1; i <= filteredWords.length; i++) {
      wordEmbeddings.push(embeddings.slice(i, 1));
    }

    for (let index = 0; index < wordEmbeddings.length; index++) {
      const wordEmbedding = wordEmbeddings[index];
      const scoreTensor = cosineSimilarity(valueEmbedding, wordEmbedding);
      const score = (await scoreTensor.data())[0];
      scoreTensor.dispose();

      // Calculate a prefix match bonus
      const word = filteredWords[index];
      const exactMatch = word === valueWord ? 1.0 : 0.0;
      const prefixMatch = word.startsWith(valueWord) ? 0.5 : 0.0;
      const weightedScore = score + prefixMatch + exactMatch;

      if (weightedScore >= threshold) {
        goodMatches.push({ word: word, score: weightedScore });
      }
    }

    embeddings.dispose();
    valueEmbedding.dispose();

    // Combine the good matches for each value word
    totalGoodMatches = totalGoodMatches.concat(goodMatches);
  }

  // Aggregate scores for the same word and sort the matches by score in descending order
  const scoreMap = totalGoodMatches.reduce((acc, match) => {
    acc[match.word] = (acc[match.word] || 0) + match.score;
    return acc;
  }, {});

  const aggregatedGoodMatches = Object.entries(scoreMap).map(([word, score]) => ({ word, score }));
  aggregatedGoodMatches.sort((a, b) => b.score - a.score);

  return aggregatedGoodMatches.slice(0, 5);
}
