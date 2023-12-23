import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import * as USE from "universal-sentence-encoder";
import {aiPredict} from "../ml/process.ts";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// Clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// To allow work offline
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('index.html'),
    { allowlist }
  )
);

// Load the Universal Sentence Encoder model
let useModel: USE.UniversalSentenceEncoder | null = null;

// Note: You might want to adjust the model loading strategy
// to make it more efficient in a service worker context.
self.addEventListener('install', (event) => {
  event.waitUntil(
    USE.load().then((model) => {
      useModel = model;
    })
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients to ensure that updates are applied immediately
  event.waitUntil(clientsClaim());
});

self.addEventListener('message', async (event) => {
  const type = event.data.type;
  let results = {};

  // Handle the model initialization
  if (type === "init") {
    if (useModel) {
      useModel.embed(event.data.words);
      results = { newDataset: event.data.words };
    } else {
      results = { error: 'Model not loaded' };
    }
  }

  if (type === "predict") {
    const { value, words, threshold } = event.data;

    if (useModel) {
      // Assume aiPredict function is defined here or imported
      results = await aiPredict(value, words, useModel, threshold);
    } else {
      results = { error: 'Model not loaded' };
    }
  }

  // Post the results back to the main thread
  return { type, results }
});
