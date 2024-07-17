import { toast } from "react-toastify";
import { takeEvery, call, put, select, all } from "redux-saga/effects";

import { patchCustomDesign, addAssetFinalToS3 } from "services/DesignerService";

import Order from "redux/models/Order";
import Checkout from "redux/models/Checkout";

import getApiErrorMessage from "utils/getApiErrorMessage";

import LassoShape from "redux/models/LassoShape";
import { handleConvertImage } from "utils/file";

const { saveLassoDesign } = LassoShape.types;

function* saveLassoDesignSaga(action) {
  try {
    const { image_proof, image_with_hole, cutFile, cb } = action.payload;

    const { front, back, front_with_hole, back_with_hole } = yield all({
      front: handleConvertImage({ image: image_proof,  mirror: true }),
      back: handleConvertImage({ image: image_proof }),
      front_with_hole: handleConvertImage({ image: image_with_hole }),
      back_with_hole: handleConvertImage({
        image: image_with_hole,
        mirror: true,
      }),
    });

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

export default function* watchApp() {
  yield takeEvery(saveLassoDesign().type, saveLassoDesignSaga);
}
