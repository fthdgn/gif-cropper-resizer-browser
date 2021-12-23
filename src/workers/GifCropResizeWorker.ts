import {Rectangle} from "../models/Rectangle";
import {cropResizeGifFrames} from "../CropResizeGifFrames";
import {decompressGif} from "../DecompressGif";
import {Size} from "../models/Size";
import {MaxSizeConfigs} from "../models/MaxSizeConfigs";

self.onmessage = function (event) {
  let base64 = event.data.image as string
  let frames = decompressGif(base64)
  let crop = event.data.crop as Rectangle | undefined
  let resize = event.data.resize as Size | undefined
  let maxSizeConfig = event.data.maxSizeConfig as MaxSizeConfigs | undefined
  const result = cropResizeGifFrames(() => new OffscreenCanvas(0, 0), frames, crop, resize, maxSizeConfig)
  self.postMessage(result)
  self.close()
};
