import {ParsedFrame} from "gifuct-js";
import {Rectangle} from "./models/Rectangle";
import {Size} from "./models/Size";
import GIFEncoder from 'gif-encoder-2-browser'
import {MaxSizeConfigs} from "./models/MaxSizeConfigs";

export function cropResizeGifFrames(canvasCreator: () => HTMLCanvasElement | OffscreenCanvas,
                                    frames: ParsedFrame[],
                                    crop?: Rectangle,
                                    resize?: Size,
                                    maxSizeConfig?: MaxSizeConfigs): string {
  const croppedGifCanvas = canvasCreator()
  const gifCanvas = canvasCreator()
  const tempCanvas = canvasCreator()

  const croppedGifContext = croppedGifCanvas.getContext("2d")!
  const gifContext = gifCanvas.getContext("2d")!
  const tempContext = tempCanvas.getContext("2d")!

  const gifWidth = frames[0].dims.width + frames[0].dims.left
  const gifHeight = frames[0].dims.height + frames[0].dims.top

  let _crop = crop ?? { x: 0, y: 0, width: gifWidth, height: gifHeight }
  let _resize = resize ?? _crop

  croppedGifCanvas.width = _resize.width
  croppedGifCanvas.height = _resize.height

  gifCanvas.width = gifWidth
  gifCanvas.height = gifHeight

  const maxTryCount = 5
  for (let tryCount = 1; maxTryCount <= (maxSizeConfig?.maxIteration ?? 1); tryCount++) {
    const encoder = new GIFEncoder(_resize.width, _resize.height);
    encoder.start()
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i]
      const imageData = tempContext.createImageData(frame.dims.width, frame.dims.height)
      imageData.data.set(frame.patch)
      tempCanvas.width = frame.dims.width
      tempCanvas.height = frame.dims.height
      tempContext.putImageData(imageData, 0, 0);
      gifContext.drawImage(tempCanvas, frame.dims.left, frame.dims.top)
      croppedGifContext.clearRect(0, 0, _resize.width, _resize.height)
      croppedGifContext.drawImage(
        gifCanvas,
        _crop.x,
        _crop.y,
        _crop.width,
        _crop.height,
        0,
        0,
        _resize.width,
        _resize.height,
      )
      encoder.setDelay(frame.delay)
      encoder.addFrame(croppedGifContext)
    }
    encoder.finish()
    const base64: string = encoder.out.getData().toString('base64')
    if (maxSizeConfig) {
      if (base64.length <= maxSizeConfig.maxBase64Length) {
        return 'data:image/gif;base64,' + base64
      } else {
        if (tryCount !== maxSizeConfig.maxIteration) {
          resize = {
            width: Math.floor(_resize.width * Math.sqrt(maxSizeConfig.maxBase64Length / base64.length)),
            height: Math.floor(_resize.height * Math.sqrt(maxSizeConfig.maxBase64Length / base64.length)),
          }
        } else {
          if (maxSizeConfig.failIfTargetNotAchieved) {
            throw Error("Cannot achieve resize target.")
          } else {
            return 'data:image/gif;base64,' + base64
          }
        }
      }
    } else {
      return 'data:image/gif;base64,' + base64
    }
  }
  throw Error("Illegal state")
}
