import EXIF from "exif-js";

import { SHAPE_LINES, SIDES } from "constants/designer";
import { DEFAULT_FONT } from "constants/designer";
import { getFabric } from "utils/fabric";

export const getFrontBackgroundShape = async (shape) => {
  let result;
  const fabric = await getFabric();
  fabric.loadSVGFromString(shape["bleed_fill"], (objects, options) => {
    result = fabric.util.groupSVGElements(objects, options);
    result.set({
      fill: "rgb(255,255,255)",
    });
  });

  return result;
};

export const getBackBackgroundShape = async (shape) => {
  const clonedShape = await clonePromise(shape);
  clonedShape.set({ flipX: true });

  return clonedShape;
};

export const setOverlay = async ({
  shape,
  fabric,
  front,
  back,
  withWarningText,
}) => {
  let frontOverlayShapes = [];
  let backOverlayShapes = [];
  let frontOverlayShapesWithoutWarning = [];
  let backOverlayShapesWithoutWarning = [];
  let frontOverlay;
  let backOverlay;

  SHAPE_LINES.map((shapeLine) => {
    fabric.loadSVGFromString(shape[shapeLine], (objects, options) => {
      const currentShape = fabric.util.groupSVGElements(objects, options);

      currentShape.set({
        fill: getFillForShape(shapeLine),
      });

      if (shapeLine === "safe_dash") {
        if (currentShape?.path?.length) {
          currentShape.set({ stroke: "green" });
        } else
          currentShape?._objects?.forEach((obj) =>
            obj.set({ stroke: "green" })
          );
      }
      if (shapeLine === "warning") {
        frontOverlayShapes.push(currentShape);

        if (!withWarningText) {
          currentShape.set({ opacity: 0 });
        }
      } else if (shapeLine === "warning_inverse") {
        backOverlayShapes.push(currentShape);

        if (!withWarningText) {
          currentShape.set({ opacity: 0 });
        }
      } else {
        frontOverlayShapes.push(currentShape);
        frontOverlayShapesWithoutWarning.push(currentShape);

        currentShape.clone((c) => {
          backOverlayShapes.push(c);
          backOverlayShapesWithoutWarning.push(c);
        });
      }

      if (frontOverlayShapes.length === SHAPE_LINES.length - 1) {
        frontOverlay = new fabric.Group(frontOverlayShapes);
        backOverlay = new fabric.Group(backOverlayShapes);
        backOverlay.set({ flipX: true });
        front.setOverlayImage(frontOverlay);
        back.setOverlayImage(backOverlay);
      }
    });
  });

  return {
    frontOverlayShapes,
    backOverlayShapes,
    frontOverlayShapesWithoutWarning,
    backOverlayShapesWithoutWarning,
    frontOverlay,
    backOverlay,
  };
};

export const resize = async ({
  containerRef,
  isMobile,
  front,
  back,
  backBackgroundShape,
  frontBackgroundShape,
}) => {
  const containerWidth = containerRef.offsetWidth;
  const containerHeight = containerRef.offsetHeight;

  const shapeWidth = frontBackgroundShape.width;
  const shapeHeight = frontBackgroundShape.height;
  const widthDelta = containerWidth / shapeWidth;
  const heightDelta = containerHeight / shapeHeight;
  let zoomBuffer = isMobile ? 100 : 300;
  let zoom;
  if (widthDelta > heightDelta) {
    zoom = containerHeight / (shapeHeight + zoomBuffer);
  } else {
    zoom = containerWidth / (shapeWidth + zoomBuffer);
  }

  const zoomBufferX = containerWidth / 2 - (shapeWidth * zoom) / 2;
  const zoomBufferY = containerHeight / 2 - (shapeHeight * zoom) / 2;

  front.viewportTransform[0] = zoom;
  front.viewportTransform[3] = zoom;
  front.viewportTransform[4] = Math.round(zoomBufferX);
  front.viewportTransform[5] = Math.round(zoomBufferY);
  back.viewportTransform = front.viewportTransform;
  front.setDimensions({ width: containerWidth, height: containerHeight });
  back.setDimensions({ width: containerWidth, height: containerHeight });
  front.getObjects().map((el) => el.setCoords());
  back.getObjects().map((el) => el.setCoords());
};

export const addImageToCanvas = async ({ stage, url }) => {
  const currentCanvas = getCurrentCanvas(stage);
  const center = currentCanvas.getVpCenter();
  const fabric = await getFabric();
  fabric.Image.fromURL(
    url,
    async (oImg) => {
      oImg.set({
        top: center.y,
        left: center.x,
        originX: "center",
        originY: "center",
      });
      if (oImg.getScaledWidth() >= currentCanvas.getWidth()) {
        oImg.scaleToWidth(currentCanvas.getWidth() - 20);
      }
      if (oImg.getScaledHeight() >= currentCanvas.getHeight()) {
        oImg.scaleToHeight(currentCanvas.getHeight() - 20);
      }
      currentCanvas.add(oImg);
      currentCanvas.setActiveObject(oImg);
    },
    { crossOrigin: "anonymous" }
  );
};

export const checkImageAndRotate = (image) => {
  return new Promise((resolve, _reject) => {
    EXIF.getData(image._originalElement, () => {
      const orientation = EXIF.getTag(image._originalElement, "Orientation");
      switch (orientation) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          image.rotate(180);
          break;
        case 4:
          image.rotate(180);
          break;
        case 5:
          image.rotate(90);
          break;
        case 6:
          image.rotate(90);
          break;
        case 7:
          image.rotate(-90);
          break;
        case 8:
          image.rotate(-90);
          break;
      }
      resolve();
    });
  });
};

export const clearSelection = async ({ front, back }) => {
  front.discardActiveObject();
  back.discardActiveObject();
};

export const getImageDataFromSide = (side, withWarningText = false, shape) => {
  const MULTIPLIER = 2;
  const { shapeWidth, shapeHeight } = shape;
  const sideZoom = side.viewportTransform;
  side.viewportTransform = [0.5, 0, 0, 0.5, 0, 0];
  side.renderAll();
  const overlay = side.overlayImage;
  const topCrop = 0;
  const leftCrop = 0;
  let beforeOpacity = null;
  const imageSettings = {
    format: "png",
    left: leftCrop,
    top: topCrop,
    width: shapeWidth / 2,
    height: shapeHeight / 2,
    multiplier: MULTIPLIER,
  };
  if (withWarningText) {
    const objects = overlay.getObjects();
    objects.map((element, i) => {
      if (i !== 3) {
        element.set({ opacity: 0 });
      } else {
        beforeOpacity = element.opacity;
      }
    });
  } else {
    beforeOpacity = 0;
    overlay.set({ opacity: 0 });
  }
  const imageData = side.toDataURL(imageSettings);
  overlay.getObjects().map((el, i) => {
    if (i === 3) {
      el.set({ opacity: beforeOpacity });
    } else {
      el.set({ opacity: 1 });
    }
  });
  overlay.set({ opacity: 1 });
  side.viewportTransform = sideZoom;
  side.renderAll();

  return imageData;
};

export const getShapeDataFromSide = (side, isWarningDisplayed = true) => {
  const { backgroundImage, overlayImage, ...sideJson } = {
    ...side.toJSON(["width", "height"]),
    backgroundFillColor: side.backgroundImage.fill,
    isWarningDisplayed,
  };

  return sideJson;
};

export const getCurrentCanvas = ({ currentSide, back, front }) =>
  currentSide === SIDES.FRONT ? front : back;

export const hexToRGB = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b];
};

export const RGBtoCMYK = (r, g, b) => {
  let c = 0,
    m = 0,
    y = 0,
    k = 0,
    z = 0;
  c = 255 - r;
  m = 255 - g;
  y = 255 - b;
  k = 255;

  if (c < k) k = c;
  if (m < k) k = m;
  if (y < k) k = y;
  if (k === 255) {
    c = 0;
    m = 0;
    y = 0;
  } else {
    c = Math.round((255 * (c - k)) / (255 - k));
    m = Math.round((255 * (m - k)) / (255 - k));
    y = Math.round((255 * (y - k)) / (255 - k));
  }

  return {
    c: Math.round((c / 255) * 100),
    m: Math.round((m / 255) * 100),
    y: Math.round((y / 255) * 100),
    k: Math.round((k / 255) * 100),
  };
};

export const toggleWarningTextShape = (side, show) => {
  side.overlayImage.getObjects().map((el, i) => {
    if (i === 3) {
      el.set({ opacity: show ? 1 : 0 });
    }
  });
};

export const duplicateImageToOtherSide = async ({
  currentSide,
  front,
  back,
}) => {
  let frontData = front.toJSON();
  let backData = back.toJSON();

  if (currentSide === SIDES.FRONT) {
    backData["objects"] = frontData["objects"];
    backData["backgroundImage"].fill = frontData["backgroundImage"].fill;
    back.loadFromJSON(backData);
  } else {
    frontData["objects"] = backData["objects"];
    frontData["backgroundImage"].fill = backData["backgroundImage"].fill;
    front.loadFromJSON(frontData);
  }
};

export const recoverDesign = async ({
  stage: { front, back },
  frontData,
  backData,
}) => {
  let OldFrontData = front.toJSON();
  let OldBackData = back.toJSON();

  const backDataNew = { ...OldBackData, ...backData };
  backDataNew["backgroundImage"] = {
    ...OldBackData["backgroundImage"],
    fill: backData["backgroundFillColor"],
  };
  back.loadFromJSON(backDataNew);

  const frontDataNew = { ...OldFrontData, ...frontData };
  frontDataNew["backgroundImage"] = {
    ...OldFrontData["backgroundImage"],
    fill: frontData["backgroundFillColor"],
  };
  front.loadFromJSON(frontDataNew);
};

export const duplicateImage = async (stage) => {
  const currentCanvas = getCurrentCanvas(stage);
  const activeGroup = currentCanvas.getActiveObjects();
  const activeObject = currentCanvas.getActiveObject();

  if (activeGroup) {
    activeGroup.forEach((el) => {
      const top = el.top + 20;
      const left = el.left + 20;
      el.clone((c) => {
        c.set({
          top: top,
          left: left,
        });
        currentCanvas.add(c);
      });
    });
  } else {
    if (activeObject != null) {
      activeObject.clone((c) => {
        c.set({
          top: c.top + 20,
          left: c.left + 20,
        }).setCoords();
        currentCanvas.add(c);
        currentCanvas.setActiveObject(c);
      });
    }
  }
};

export const addTextToCanvas = async (text, stage) => {
  const currentCanvas = getCurrentCanvas(stage);
  const center = currentCanvas.getVpCenter();
  const fabric = await getFabric();
  const MAX_CHARACTERS = 17;

  const splitWord = (str, length) => {
    var words = str.split(" ");
    for (var j = 0; j < words.length; j++) {
      var l = words[j].length;
      if (l > length) {
        var result = [],
          i = 0;
        while (i < l) {
          result.push(words[j].substr(i, length));
          i += length;
        }
        words[j] = result.join("-\n");
      }
    }
    return words.join("-\n");
  };

  const splitText = (txt) => {
    const arrTxt = txt.split(" ");
    return arrTxt.reduce((acc, current) => {
      if (current?.length > MAX_CHARACTERS)
        return acc + "\n" + splitWord(current, MAX_CHARACTERS - 1);
      if (acc?.split("\n").pop()?.length + current?.length > MAX_CHARACTERS)
        return acc + "\n" + current;
      return acc + " " + current;
    }, "");
  };

  const textObject = new fabric.IText(splitText(text), {
    top: center.y,
    left: center.x,
    originX: "center",
    originY: "center",
    fontSize: 70,
  });
  currentCanvas.add(textObject);
  textObject.set({
    fontFamily: DEFAULT_FONT,
  });

  return textObject;
};

export const otherSideHasObjects = ({ currentSide, back, front }) =>
  currentSide === SIDES.FRONT
    ? back.getObjects().length > 0
    : front.getObjects().length > 0;

const getFillForShape = (shapeLine) => {
  if (shapeLine === "hole_dash") {
    return "rgb(255,255,255)";
  } else if (shapeLine === "bleed_dash") {
    return "red";
  }
};

const clonePromise = (shape) =>
  new Promise((resolve, reject) => {
    shape.clone((c) => {
      resolve(c);
    });
  });
