import { toast } from "react-toastify";
import { takeEvery, call, put, select, delay, all } from "redux-saga/effects";

import {
  getImage,
  postProcessImage,
  putStringHole,
} from "services/CustomShapeService";
import { patchCustomDesign, addAssetFinalToS3 } from "services/DesignerService";

import Order from "redux/models/Order";
import Checkout from "redux/models/Checkout";
import CustomShape from "redux/models/CustomShape";

import {
  STATUS_FAILED,
  STATUS_IN_PROGRESS,
  STATUS_COMPLETED,
} from "constants/custom_shape";
import getApiErrorMessage from "utils/getApiErrorMessage";
import getConfig from "next/config";

const {
  getProcessedImage,
  processImage,
  create,
  update,
  drawStringHole,
  saveCustomDesign,
} = CustomShape.types;

function* processImageSaga(action) {
  try {
    const { cropType, file, cb } = action.payload;

    const { id: order_id } = yield select(Order.selectors.getOrder);
    const design_id = yield select(Checkout.selectors.getSelectedDesign);

    yield put(create({ task: { status: STATUS_IN_PROGRESS } }));

    let initialInfo = yield call(postProcessImage, {
      cropType,
      file,
      order_id,
      design_id,
    });

    yield put(create({ ...initialInfo, task: { status: STATUS_IN_PROGRESS } }));

    yield put(getProcessedImage({ cb }));
  } catch (err) {
    yield put(
      update({
        task: {
          status: STATUS_FAILED,
          message:
            getApiErrorMessage(err)?.original_image?.length > 0
              ? getApiErrorMessage(err)?.original_image[0]
              : null,
        },
      })
    );

    // if (getApiErrorMessage(err)?.original_image?.length > 0)
    //   toast.error(getApiErrorMessage(err)?.original_image[0]);
    // else toast.error("Something went wrong!");

    const { cb } = action.payload;
    if (cb) cb(STATUS_FAILED);
  }
}

function* getProcessedImageSaga(action) {
  try {
    const { cb } = action.payload;

    const { publicRuntimeConfig } = getConfig();

    const madUnicornCount =
      parseInt(sessionStorage.getItem("mu-count"), 0) || 0;

    const image_id = yield select(CustomShape.selectors.getCustomShapeId);

    let processedInfo = yield call(getImage, { id: image_id });

    if (
      processedInfo.task.status === STATUS_IN_PROGRESS ||
      (processedInfo.task.status === STATUS_COMPLETED &&
        !processedInfo?.image_with_padding)
    ) {
      if (
        !(
          madUnicornCount >=
          (parseInt(publicRuntimeConfig?.muTimeout, 10) || 15) - 1
        )
      ) {
        sessionStorage.setItem("mu-count", madUnicornCount + 1);

        yield delay(1000);
        yield put(getProcessedImage({ cb }));
      } else throw new Error("AI timeout");
    } else {
      sessionStorage.setItem("mu-count", 0);

      yield put(update({ ...processedInfo }));
    }

    if (cb) cb(processedInfo.task.status);
  } catch (err) {
    yield put(update({ task: { status: STATUS_FAILED } }));
    console.log(err);
    sessionStorage.setItem("mu-count", 0);

    // if (err?.response?.data?.non_field_errors)
    //   toast.error(err?.response?.data?.non_field_errors[0]);
    // else toast.error("Something went wrong!");

    const { cb } = action.payload;
    if (cb) cb(STATUS_FAILED);
  }
}

function* drawStringHoleSaga(action) {
  try {
    const { position, cb } = action.payload;

    const image_id = yield select(CustomShape.selectors.getCustomShapeId);

    yield put(update({ task: { status: STATUS_IN_PROGRESS } }));

    let newImage = yield call(putStringHole, {
      id: image_id,
      position,
    });

    yield put(update({ ...newImage }));

    if (cb) cb({ ...newImage });
  } catch (err) {
    yield put(update({ task: { status: STATUS_FAILED } }));
    console.log(err);
    // if (err?.response?.data?.non_field_errors)
    //   toast.error(err?.response?.data?.non_field_errors[0]);
    // else toast.error("Something went wrong!");
  }
}

function* saveDesignSaga(action) {
  try {
    const { front, back, front_with_hole, back_with_hole, cutFile, cb } =
      action.payload;

    const { id: order_id } = yield select(Order.selectors.getOrder);
    const design_id = yield select(Checkout.selectors.getSelectedDesign);

    const { front_url, back_url, front_proof_url, back_proof_url, cut_file } =
      yield all({
        front_url: call(addAssetFinalToS3, front, design_id),
        back_url: call(addAssetFinalToS3, back, design_id),
        front_proof_url: call(addAssetFinalToS3, front_with_hole, design_id),
        back_proof_url: call(addAssetFinalToS3, back_with_hole, design_id),
        cut_file: call(addAssetFinalToS3, cutFile, design_id, "svg"),
      });

    yield call(patchCustomDesign, {
      id: design_id,
      front_url: front_url.url,
      back_url: back_url.url,
      front_proof: front_proof_url.url,
      back_proof: back_proof_url.url,
      cut_file: cut_file.url,
    });

    yield put(Order.types.retrieveOrder({ orderId: order_id }));
    if (cb) cb();
  } catch (error) {
    const { onError } = action.payload;
    console.error(error);
    toast.error(error.message || "Unable to upload image");
    if (onError) onError();
  }
}

export default function* watchCustomShape() {
  yield takeEvery(processImage().type, processImageSaga);
  yield takeEvery(getProcessedImage().type, getProcessedImageSaga);
  yield takeEvery(drawStringHole().type, drawStringHoleSaga);
  yield takeEvery(saveCustomDesign().type, saveDesignSaga);
}
