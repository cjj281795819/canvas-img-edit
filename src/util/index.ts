/**
 * 获取ratio
 * @param context 
 */
export const getPixelRatio = (context: CanvasRenderingContext2D) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};
/**
 * 获取选中框的8个点
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
export const getDotPosition = (x: number, y: number, w: number, h: number) => {
  return [
    [x - 2, y - 2, 4, 4],
    [x + w / 2 - 2, y - 2, 4, 4],
    [x + w - 2, y - 2, 4, 4],
    [x - 2, y + h / 2 - 2, 4, 4],
    [x + w - 2, y + h / 2 - 2, 4, 4],
    [x - 2, y + h - 2, 4, 4],
    [x + w / 2 - 2, y + h - 2, 4, 4],
    [x + w - 2, y + h - 2, 4, 4],
  ];
};
/**
 * 获取选中框的虚线
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
export const getDashPosition = (x: number, y: number, w: number, h: number) => {
  return [
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + 2 * h / 3, x + w, y + 2 * h / 3],
    [x + w / 3, y, x + w / 3, y + h],
    [x + 2 * w / 3, y, x + 2 * w / 3, y + h]
  ];
};

type SelectPosi = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * 判断选中框是否到外界了，返回选中框新位置
 * @param w 
 * @param h 
 * @param select 
 */
export const checkSelectBoundary = (w: number, h: number, select: SelectPosi) => {
  // 只需要判断左上角和右下角
  const _select = { ...select };

  _select.x < 0 && (_select.x = 0);
  _select.y < 0 && (_select.y = 0);

  _select.x + _select.w > w && (_select.x -= _select.x + _select.w - w);
  _select.y + _select.h > h && (_select.y -= _select.y + _select.h - h);

  return _select;
};

export const getMousePosi = (x: number, y: number, w: number, h: number) => {
  return [
    // 左上 右上 右下 左下 四个点
    [x - 4, y - 4, 8, 8],
    [x + w - 4, y - 4, 8, 8],
    [x + w - 4, y + h - 4, 8, 8],
    [x - 4, y + h - 4, 8, 8],
    // 上 右 下 左 四条边
    [x - 4, y - 4, w + 4, 8],
    [x + w - 4, y - 4, 8, h + 4],
    [x - 4, y + h - 4, w + 4, 8],
    [x - 4, y - 4, 8, h + 4]
  ]
};

export const getCursorStyle = (i: number) => {
  let cursor = 'default';
  switch (i) {
    case 0:
    case 2: cursor = 'nwse-resize'; break;
    case 1:
    case 3: cursor = 'nesw-resize'; break;
    case 4:
    case 6: cursor = 'ns-resize'; break;
    case 5:
    case 7: cursor = 'ew-resize'; break;
    case 8: cursor = 'move'; break;
    default: break;
  };
  return cursor;
};

type Distance = {
  x: number;
  y: number;
};

export const handleMouseInfo = (i: number, select: SelectPosi, distance: Distance) => {
  const _select = { ...select };
  switch (i) {
    case 0:
      _select.x += distance.x;
      _select.y += distance.y;
      _select.w -= distance.x;
      _select.h -= distance.y;
      break;
    case 1:
      _select.y += distance.y;
      _select.w += distance.x;
      _select.h -= distance.y;
      break;
    case 2:
      _select.w += distance.x;
      _select.h += distance.y;
      break;
    case 3:
      _select.x += distance.x;
      _select.w -= distance.x;
      _select.h += distance.y;
      break;
    case 4:
      _select.y += distance.y;
      _select.h -= distance.y;
      break;
    case 5:
      _select.w += distance.x;
      break;
    case 6:
      _select.h += distance.y;
      break;
    case 7:
      _select.x += distance.x;
      _select.w -= distance.x;
      break;
    case 8:
      _select.x += distance.x;
      _select.y += distance.y;
      break;
    default: break;
  };

  return _select;
};

export const getAnewXY = (select: SelectPosi) => {
  return {
    x: select.x + (select.w < 0 ? select.w : 0),
    y: select.y + (select.h < 0 ? select.h : 0),
    w: Math.abs(select.w),
    h: Math.abs(select.h)
  };
};

type GetDataOptions = {
  imgSize: {
    width: number;
    height: number
  },
  rotate: number,
  img: HTMLImageElement,
  canvasSize: {
    width: number;
    height: number
  },
  imgScale: number,
  grayscale: boolean,
  selectPosi: SelectPosi,
};

export const getPhotoData = (
  {
    imgSize, rotate, img, canvasSize, imgScale, selectPosi, grayscale
  }: GetDataOptions
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  let { width: imgWidth, height: imgHeight } = imgSize;

  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };

  canvas.width = imgWidth;
  canvas.height = imgHeight;

  ctx.save();
  ctx.translate(imgWidth / 2, imgHeight / 2);
  ctx.rotate(Math.PI / 180 * rotate);
  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };
  ctx.translate(-imgWidth / 2, - imgHeight / 2);
  ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
  ctx.restore();

  let { width: canvasWidth, height: canvasHeight } = canvasSize;

  if (rotate % 180 !== 0) {
    [imgWidth, imgHeight] = [imgHeight, imgWidth];
  };

  const putX = (((imgWidth - canvasWidth / imgScale) / 2) + selectPosi.x / imgScale);
  const putY = (((imgHeight - canvasHeight / imgScale) / 2) + selectPosi.y / imgScale);
  const putW = selectPosi.w / imgScale;
  const putH = selectPosi.h / imgScale;

  if (!putW || !putH) {
    return '';
  };

  const imgData = ctx.getImageData(putX, putY, putW, putH);

  if (grayscale) {
    getGrayscaleData(imgData);
  };

  canvas.width = putW;
  canvas.height = putH;

  ctx.putImageData(imgData, 0, 0);

  return new Promise(res => {
    canvas.toBlob(e => res(e));
  })
};

export const getGrayscaleData = (imgData: ImageData) => {
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grayscale = (data[i] + data[i + 1] * 2 + data[i + 2]) >> 2;
    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  };
  return data;
};