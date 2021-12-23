# gif-cropper-resizer-browser

Crops and resizes gifs on browser.

It uses web workers and OffscreenCanvas if available.

It requires `webpack: '>=5.0.0'`.

## Installation

```
npm install gif-cropper-resizer-browser
```

## Usage

```js
import {cropResizeGif} from "gif-cropper-resizer-browser";

let resultBase64Data = await cropResizeGif(
  imageBase64Data, //Gif image on base64 data format. "data:image/gif;base64,..." 
  {x: 10, y: 10, width: 50, height: 50}, //Rectangle to crop, default is all the gif
  {width: 25, height: 25}, //Target resolution of the cropped image. default is the size of crop. The result can be smaller than this if `maxSizeConfig` is set
  {// Configuration for maximum allowed result size. It is optional
    maxBase64Length: 10000000, // Maximum base64 string length of result
    maxIteration: 5, //Maximum iteration number until achieving `maxBase64Length`
    failIfTargetNotAchieved: false, //Whether to fail or not when `maxBase64Length` is not achieved and the iteration count reached `maxIteration`
  }
)
```

### How

* Decompress the input gif by [gifuct-js](https://github.com/matt-way/gifuct-js) to its frames
* Draw each frame on canvas while cropping and resizing
* Encode canvas content as frames by [gif-encoder-2-browser](https://github.com/fthdgn/gif-encoder-2-browser) ([gif-encoder-2](https://github.com/benjaminadk/gif-encoder-2/))
