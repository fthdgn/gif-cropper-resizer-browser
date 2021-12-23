import {decompressFrames, parseGIF} from "gifuct-js";

export function decompressGif(imageBase64Data: string) {
  const imgBuffer = _base64ToArrayBuffer(imageBase64Data)
  const parsedGif = parseGIF(imgBuffer)
  return decompressFrames(parsedGif, true)
}

function _base64ToArrayBuffer(imageBase64Data: string): ArrayBuffer {
  // noinspection JSDeprecatedSymbols
  const binary_string = atob(imageBase64Data.substring("data:image/gif;base64,".length));
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
