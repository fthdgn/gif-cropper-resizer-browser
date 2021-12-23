import {Rectangle} from "../models/Rectangle";
import {Size} from "../models/Size";
import {MaxSizeConfigs} from "../models/MaxSizeConfigs";

export function cropResizeGifOnWorker(image: string, crop?: Rectangle, resize?: Size, maxSizeConfig?: MaxSizeConfigs): Promise<string> {
  let worker = new Worker(new URL('./GifCropResizeWorker.js', import.meta.url));
  let promise: Promise<string> = new Promise((resolve, reject) => {
    worker.onmessageerror = ev => {
      reject(ev)
      worker.terminate()
    }
    worker.onmessage = ev => {
      if (typeof ev.data === "string") {
        resolve(ev.data)
        worker.terminate()
      }
    }
  })
  worker.postMessage({ image, crop, resize, maxSizeConfig })
  return promise
}
