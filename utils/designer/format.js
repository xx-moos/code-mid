import { toast } from "react-toastify";
import { getCurrentCanvas } from "utils/designer/canvas";

export const alignCenterHorizontal = async ({ currentSide, front, back }) => {
  const currentCanvas = getCurrentCanvas({ currentSide, front, back });
  const activeObject = currentCanvas.getActiveObject();
  let group = currentCanvas.getActiveObjects();
  const center = front.getVpCenter();

  if (activeObject?.hasOwnProperty("_objects")) {
    activeObject.forEachObject((obj) => {
      let itemWidth = obj.getScaledWidth();
      obj.set({
        left: 0 - itemWidth / 2,
        originX: "left",
      });
      obj.setCoords();
    });
  } else {
    if (!group.length) toast.error("No element to format");
    group.forEach((item) => {
      item.set({
        left: center.x,
        originX: "center",
      });
      item.setCoords();
    });
  }
};

export const alignCenterVertical = async ({ currentSide, front, back }) => {
  const currentCanvas = getCurrentCanvas({ currentSide, front, back });
  const activeObject = currentCanvas.getActiveObject();

  if (activeObject?.hasOwnProperty("_objects")) {
    activeObject.forEachObject((obj) => {
      let itemHeight = obj.getScaledHeight();
      obj.set({
        top: 0 - itemHeight / 2,
        originY: "top",
      });
      obj.setCoords();
    });
  } else {
    let group = currentCanvas.getActiveObjects();
    if (!group.length) toast.error("No element to format");
    group.forEach((item) => {
      const center = front.getVpCenter();
      item.set({
        top: center.y,
        originY: "center",
      });
      item.setCoords();
    });
  }
};

const baseManipulate = ({ front, back, currentSide, manipulate }) => {
  const currentCanvas = getCurrentCanvas({ front, back, currentSide });
  if (!currentCanvas.getActiveObjects().length)
    toast.error("No element to format");
  currentCanvas.getActiveObjects().forEach((item) => manipulate(item));
};

export const moveLayerUp = (stage) => {
  const currentCanvas = getCurrentCanvas({ ...stage });
  const manipulate = (item) => currentCanvas.bringForward(item);
  baseManipulate({ ...stage, manipulate });
};

export const moveLayerDown = (stage) => {
  const currentCanvas = getCurrentCanvas({ ...stage });
  const manipulate = (item) => currentCanvas.sendBackwards(item);
  baseManipulate({ ...stage, manipulate });
};

const scale = (scaleFactor, currentCanvas) => {
  const object = currentCanvas.getActiveObject();
  const group = currentCanvas.getActiveObjects();

  const manipulate = (item) => {
    if (item.scaleX <= 0.1 && scaleFactor < 0) return;

    item.set({
      scaleX: item.scaleX + scaleFactor,
      scaleY: item.scaleY + scaleFactor,
    });
  };
  if (group !== null) {
    if (!group.length) toast.error("Please select image");
    group.forEach(manipulate);
  } else {
    manipulate(object);
  }
};

export const scaleUp = (stage) => {
  const currentCanvas = getCurrentCanvas(stage);
  scale(0.1, currentCanvas);
};

export const scaleDown = (stage) => {
  const currentCanvas = getCurrentCanvas(stage);
  scale(-0.1, currentCanvas);
};
