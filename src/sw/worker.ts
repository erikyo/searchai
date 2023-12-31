import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {clientsClaim} from 'workbox-core';
import * as USE from "universal-sentence-encoder-alt";
import {aiPredict} from "../ml/process.ts";

declare let self: ServiceWorkerGlobalScope

// Load the Universal Sentence Encoder model
let model: USE.UniversalSentenceEncoder | null = null;

// Clean old assets
cleanupOutdatedCaches();

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// @ts-ignore
let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]


// Note: You might want to adjust the model loading strategy
// to make it more efficient in a service worker context.
self.addEventListener('install', (event) => {
  event.waitUntil(
    USE.load().then((USEmodel) => {
      model = USEmodel;
    })
  );
});

self.addEventListener('activate', () => {
  // Claim clients to ensure that updates are applied immediately
  clientsClaim()
});

self.addEventListener('message', async (event) => {
  const type = event.data.type;
  let results = {};

  if (event.data && type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle the model initialization
  if (type === "init") {
    if (!model) {
      model = await USE.load();
    }
    await model.embed(event.data.words);
    results = {result: {dataset: event.data.words}};
  }

  if (type === "predict") {
    const {value, words, threshold} = event.data;

    if (model) {
      // Assume aiPredict function is defined here or imported
      results = await aiPredict(value, words, model, threshold);
    } else {
      results = {error: 'Model not loaded'};
    }
  }

  console.log(results);

  // Post the results back to the main thread
  event.source?.postMessage({type, results})
});
