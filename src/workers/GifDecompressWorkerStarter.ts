import {ParsedFrame} from "gifuct-js";

export function decompressGifOnWorker(image: string): Promise<ParsedFrame[]> {
  let worker = new Worker(new URL('./GifDecompressWorker.js', import.meta.url));
  let frames: ParsedFrame[] = []
  let promise: Promise<ParsedFrame[]> = new Promise((resolve, reject) => {
    worker.onmessageerror = ev => {
      reject(ev)
      worker.terminate()
    }
    worker.onmessage = ev => {
      if (ev.data === "close") {
        resolve(frames)
        worker.terminate()
      } else {
        if (ev.data.type !== "RPC") {
          frames.push(...ev.data)
        }
      }
    }
  })
  worker.postMessage(image)
  return promise
}
