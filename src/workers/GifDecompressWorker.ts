import { decompressGif } from "../DecompressGif";

self.onmessage = function (event) {
  let frames = decompressGif(event.data)
  const PART = 100
  for (let i = 0; i < frames.length; i = i + PART) {
    self.postMessage(frames.slice(i, Math.min(frames.length, i + PART)))
  }
  self.postMessage("close")
  self.close()
};
