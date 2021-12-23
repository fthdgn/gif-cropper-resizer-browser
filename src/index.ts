import {ParsedFrame} from "gifuct-js";
import {Rectangle} from "./models/Rectangle";
import {cropResizeGifFrames} from "./CropResizeGifFrames";
import {decompressGif} from "./DecompressGif";
import {Size} from "./models/Size";
import {MaxSizeConfigs} from "./models/MaxSizeConfigs";
import {cropResizeGifOnWorker} from "./workers/GifCropResizeWorkerStarter";
import {decompressGifOnWorker} from "./workers/GifDecompressWorkerStarter";

/**
 * Crops and resizes input image
 * @param imageBase64Data Gif image on base64 data format. "data:image/gif;base64,..."
 * @param crop Rectangle to crop, default is all the gif
 * @param resize Target resolution of the cropped image. default is the size of crop. The result can be smaller than this if `maxSizeConfig` is set
 * @param maxSizeConfig Configuration for maximum allowed result size. It is optional
 */
export async function cropResizeGif(imageBase64Data: string,
                                    crop?: Rectangle,
                                    resize?: Size,
                                    maxSizeConfig?: MaxSizeConfigs): Promise<string> {
  if (typeof Worker === 'undefined') {
    const frames = decompressGif(imageBase64Data)
    return cropResizeGifFrames(() => document.createElement("canvas"), frames, crop, resize, maxSizeConfig)
  } else if (typeof OffscreenCanvas !== 'undefined') {
    return await cropResizeGifOnWorker(imageBase64Data, crop, resize, maxSizeConfig)
  } else {
    let frames: ParsedFrame[] = await decompressGifOnWorker(imageBase64Data)
    return cropResizeGifFrames(() => document.createElement("canvas"), frames, crop, resize, maxSizeConfig)
  }
}
