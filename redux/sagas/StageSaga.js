import { toast } from "react-toastify";
import { takeEvery, call, put, select } from "redux-saga/effects";

import Stage from "redux/models/Stage";
import Checkout from "redux/models/Checkout";
import Design from "redux/models/Design";
import Order from "redux/models/Order";
import App from "redux/models/App";
import {
  addImageToCanvas,
  getCurrentCanvas,
  duplicateImage,
  duplicateImageToOtherSide,
  clearSelection,
  toggleWarningTextShape,
  addTextToCanvas as addTextToCanvasFunction,
  getImageDataFromSide,
  getShapeDataFromSide,
} from "utils/designer/canvas";
import {
  alignCenterHorizontal as alignCenterHorizontalFunction,
  alignCenterVertical as alignCenterVerticalFunction,
  moveLayerUp as moveLayerUpFunction,
  moveLayerDown as moveLayerDownFunction,
  scaleDown as scaleDownFunction,
  scaleUp as scaleUpFunction,
} from "utils/designer/format";
import {
  addAsset,
  patchDesign,
  addAssetFinalToS3,
  restoreDesignWarning,
  removeDesignWarning,
} from "services/DesignerService";
import { SIDES } from "constants/designer";
import getConfig from "next/config";
import { getApiFirstErrorMessage } from "utils/getApiErrorMessage";
import { track } from "utils/googleTag";

const {
  uploadImage,
  displayProcessedImage,
  saveDesign,
  update,
  toggleSide,
  deleteItem,
  setBackgroundColor,
  setWithWarningText,
  duplicate,
  duplicateToOtherSide,
  alignCenterHorizontal,
  alignCenterVertical,
  moveLayerUp,
  moveLayerDown,
  scaleDown,
  scaleUp,
  addTextToCanvas,
  handleObjectChange,
  undo,
  redo,
  renderCanvas,
  saveDesignName,
} = Stage.types;
const { getStage } = Stage.selectors;
const { getSelectedDesign } = Checkout.selectors;
const { getDesign } = Design.selectors;
const { retrieveDesign } = Design.types;
const { retrieveOrder } = Order.types;

function* saveDesignSaga(action) {
  const { cb } = action.payload;
  try {
    yield put(App.types.showLoader());

    const design = yield select(getSelectedDesign);
    const stage = yield select(getStage);
    const state = yield select();
    const order = state.Order.items[0];

    const { front, back, withWarningText } = stage;
    const frontData = getImageDataFromSide(front, withWarningText, stage);
    const backData = getImageDataFromSide(back, withWarningText, stage);
    const frontJson = getShapeDataFromSide(front);
    const backJson = getShapeDataFromSide(back);

    const { url: front_url } = yield call(addAssetFinalToS3, frontData, design);
    const { url: back_url } = yield call(addAssetFinalToS3, backData, design);

    yield call(patchDesign, {
      id: design,
      warning_enabled: withWarningText,
      data: {
        front: frontJson,
        back: backJson,
      },
      front_url,
      back_url,
    });

    yield put(retrieveOrder({ orderId: order }));

    front.renderAll();
    back.renderAll();

    if (cb) cb();
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Unable to upload image");
    if (cb) cb();
  }
}

function* saveDesignNameSaga(action) {
  try {
    const { name, designId } = action.payload;

    yield call(patchDesign, { id: designId, name });
  } catch (error) {
    const errorMessage = getApiFirstErrorMessage(error);
    toast.error(errorMessage);
  }
}

function* uploadImageSaga(action) {
  try {
    yield put(App.types.showLoader());
    track("Upload Image");

    const design = yield select(getSelectedDesign);

    yield call(addAsset, action.payload, design);
  } catch (error) {
    toast.error(error.message || "Unable to upload image");
    yield put(App.types.hideLoader());
  }
}

function* displayProcessedImageSaga(action) {
  try {
    const { url } = action.payload;
    const stage = yield select(getStage);

    const {
      publicRuntimeConfig: { designerS3Url },
    } = getConfig();

    if (url)
      yield call(addImageToCanvas, { stage, url: `${designerS3Url}/${url}` });
    yield call(renderCanvasSaga);
    yield put(update({ imageUrl: `${designerS3Url}/${url}` }));
  } catch (error) {
    toast.error(error.message || "Unable to upload image");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* renderCanvasSaga(currentSide) {
  const stage = yield select(getStage);
  const { front, back } = stage;

  if (currentSide) {
    const currentCanvas = getCurrentCanvas(stage);
    currentCanvas.renderAll();
  } else {
    front.renderAll();
    back.renderAll();
  }
}

function* toggleSideSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(clearSelection, stage);
    const updatedSide =
      stage.currentSide === SIDES.FRONT ? SIDES.BACK : SIDES.FRONT;
    yield put(update({ currentSide: updatedSide }));
    yield call(renderCanvasSaga);
  } catch (error) {
    toast.error(error.message || "Unable to toggle side");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* deleteItemSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    const { currentSide } = stage;
    const currentCanvas = getCurrentCanvas(stage);
    const activeObject = currentCanvas.getActiveObject();
    currentCanvas.remove(activeObject);

    yield call(renderCanvasSaga);
    const attributes = {};
    attributes[currentSide] = currentCanvas;
    yield put(update({ attributes, activeTab: null }));
  } catch (error) {
    toast.error(error.message || "Unable to delete image");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* setBackgroundColorSaga(action) {
  try {
    yield put(App.types.showLoader());
    const { color } = action.payload;
    const stage = yield select(getStage);
    const currentCanvas = getCurrentCanvas(stage);
    currentCanvas.backgroundImage.set({ fill: color });
    yield call(handleObjectChangeSaga);

    yield call(renderCanvasSaga);
    yield put(update({ ...stage }));
  } catch (error) {
    toast.error(error.message || "Unable to set background");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* setWithWarningTextSaga(action) {
  try {
    yield put(App.types.showLoader());
    const { withWarningText, initCheckout, design_id, cb } = action.payload;
    const stage = yield select(getStage);
    const { Order } = yield select();
    const { id: order_id } = Order.itemsById[Order.items[0]];

    if (!initCheckout) {
      if (withWarningText) restoreDesignWarning(design_id);
      else removeDesignWarning(design_id);
    }

    const { back, front } = stage;
    [back, front].forEach((side) =>
      toggleWarningTextShape(side, withWarningText)
    );
    yield call(renderCanvasSaga);

    if (design_id) yield put(retrieveDesign({ designId: design_id }));
    if (cb) cb();
  } catch (error) {
    toast.error(error.message || "Unable to set with warning text");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* duplicateSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(duplicateImage, stage);
    yield call(renderCanvasSaga);
  } catch (error) {
    toast.error(error.message || "Unable to duplicate");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* duplicateToOtherSideSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(duplicateImageToOtherSide, stage);
    yield call(clearSelection, stage);
    yield call(toggleSideSaga);
    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to duplicate to other side");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* alignCenterHorizontalSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(alignCenterHorizontalFunction, stage);
    yield call(renderCanvasSaga);
    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to align center horizontal");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* alignCenterVerticalSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(alignCenterVerticalFunction, stage);
    yield call(renderCanvasSaga);
    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to align center vertical");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* moveLayerUpSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(moveLayerUpFunction, stage);
    yield call(renderCanvasSaga);

    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to move layer up");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* moveLayerDownSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    yield call(moveLayerDownFunction, stage);
    yield call(renderCanvasSaga);

    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to move layer down");
    console.error(error.message);
    console.error(error);
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* scaleUpSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    scaleUpFunction(stage);
    yield call(renderCanvasSaga);
    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to scale up");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* scaleDownSaga(action) {
  try {
    yield put(App.types.showLoader());
    const stage = yield select(getStage);
    scaleDownFunction(stage);
    yield call(renderCanvasSaga);
    yield call(handleObjectChangeSaga);
  } catch (error) {
    toast.error(error.message || "Unable to scale down");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* addTextToCanvasSaga(action) {
  try {
    yield put(App.types.showLoader());
    const { text } = action.payload;
    const stage = yield select(getStage);
    const textObject = yield call(addTextToCanvasFunction, text, stage);
    yield call(handleObjectChangeSaga);

    yield call(renderCanvasSaga);
    textObject.setCoords();
    const currentCanvas = getCurrentCanvas(stage);
    currentCanvas.setActiveObject(textObject);
  } catch (error) {
    toast.error(error.message || "Unable to add text to canvas");
  } finally {
    yield put(App.types.hideLoader());
  }
}

function* handleObjectChangeSaga(action) {
  try {
    const stage = yield select(getStage);
    const currentCanvas = getCurrentCanvas(stage);

    const currentSnapshot = currentCanvas.toJSON();
    if (stage.currentSide === SIDES.FRONT) {
      stage.frontUndoHistory.push(currentSnapshot);
      stage.frontRedoHistory = [];
    } else {
      stage.backUndoHistory.push(currentSnapshot);
      stage.backRedoHistory = [];
    }

    yield put(
      update({
        ...stage,
        hasUndo: {
          front: stage.frontUndoHistory.length > 1,
          back: stage.backUndoHistory.length > 1,
        },
        hasRedo: {
          front: stage.frontRedoHistory.length > 0,
          back: stage.backRedoHistory.length > 0,
        },
      })
    );
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
}

function* undoSaga(action) {
  try {
    const stage = yield select(getStage);

    if (stage.currentSide === SIDES.FRONT) {
      const redoAction = stage.frontUndoHistory.pop();
      const action = stage.frontUndoHistory[stage.frontUndoHistory.length - 1];
      stage.frontRedoHistory.push(redoAction);
      stage.front.loadFromJSON(action);
    } else {
      const redoAction = stage.backUndoHistory.pop();
      const action = stage.backUndoHistory[stage.backUndoHistory.length - 1];
      stage.backRedoHistory.push(redoAction);
      stage.back.loadFromJSON(action);
    }
    yield put(
      update({
        ...stage,
        hasUndo: {
          front: stage.frontUndoHistory.length > 1,
          back: stage.backUndoHistory.length > 1,
        },
        hasRedo: {
          front: stage.frontRedoHistory.length > 0,
          back: stage.backRedoHistory.length > 0,
        },
      })
    );
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
}

function* redoSaga(action) {
  try {
    const stage = yield select(getStage);

    if (stage.currentSide === SIDES.FRONT) {
      const action = stage.frontRedoHistory.pop();
      stage.frontUndoHistory.push(action);
      stage.front.loadFromJSON(action);
    } else {
      const action = stage.backRedoHistory.pop();
      stage.backUndoHistory.push(action);
      stage.back.loadFromJSON(action);
    }
    yield put(
      update({
        ...stage,
        hasUndo: {
          front: stage.frontUndoHistory.length > 1,
          back: stage.backUndoHistory.length > 1,
        },
        hasRedo: {
          front: stage.frontRedoHistory.length > 0,
          back: stage.backRedoHistory.length > 0,
        },
      })
    );
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
}

export default function* watchStage() {
  yield takeEvery(saveDesign().type, saveDesignSaga);
  yield takeEvery(uploadImage().type, uploadImageSaga);
  yield takeEvery(toggleSide().type, toggleSideSaga);
  yield takeEvery(deleteItem().type, deleteItemSaga);
  yield takeEvery(setBackgroundColor().type, setBackgroundColorSaga);
  yield takeEvery(setWithWarningText().type, setWithWarningTextSaga);
  yield takeEvery(duplicate().type, duplicateSaga);
  yield takeEvery(duplicateToOtherSide().type, duplicateToOtherSideSaga);
  yield takeEvery(alignCenterHorizontal().type, alignCenterHorizontalSaga);
  yield takeEvery(alignCenterVertical().type, alignCenterVerticalSaga);
  yield takeEvery(moveLayerUp().type, moveLayerUpSaga);
  yield takeEvery(moveLayerDown().type, moveLayerDownSaga);
  yield takeEvery(scaleUp().type, scaleUpSaga);
  yield takeEvery(scaleDown().type, scaleDownSaga);
  yield takeEvery(addTextToCanvas().type, addTextToCanvasSaga);
  yield takeEvery(handleObjectChange().type, handleObjectChangeSaga);
  yield takeEvery(renderCanvas().type, renderCanvasSaga);
  yield takeEvery(undo().type, undoSaga);
  yield takeEvery(redo().type, redoSaga);
  yield takeEvery(saveDesignName().type, saveDesignNameSaga);
  yield takeEvery(displayProcessedImage().type, displayProcessedImageSaga);
}
