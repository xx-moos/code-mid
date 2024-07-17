import { toast } from "react-toastify";
import { takeEvery, call, put } from "redux-saga/effects";

import { getOrdersList, getOrderConfirmation } from "services/OrderService";

import { getDesignsList } from "services/DesignerService";

import Profile from "redux/models/Profile";

const { getDesigns, getOrders, updateProfile, retrieveOrderConfirmation } =
  Profile.types;

function* getOrdersSaga(action) {
  try {
    const orders = yield call(getOrdersList);
    yield put(updateProfile({ orders }));

    if (action.payload?.cb) action.payload.cb();
  } catch (err) {
    if (action?.payload?.catchCb) {
      action?.payload?.catchCb?.(err);
    } else {
      toast.error(err.message || "Something went wrong!");
    }
  } finally {
    action.payload?.finallyCb?.();
  }
}

function* getDesignSaga(action) {
  try {
    const designs = yield call(getDesignsList);
    yield put(updateProfile({ designs }));
  } catch (err) {
    if (action?.payload?.catchCb) {
      action?.payload?.catchCb?.(err);
    } else {
      toast.error(err.message || "Something went wrong!");
    }
  } finally {
    action.payload?.finallyCb?.();
  }
}

function* getOrderConfirmationSaga(action) {
  try {
    const { orderId } = action.payload;
    const order = yield call(getOrderConfirmation, { id: orderId });

    yield put(updateProfile({ selectedOrder: order }));
  } catch (err) {
    if (action?.payload?.catchCb) {
      action?.payload?.catchCb?.(err);
    } else {
      toast.error(err.message || "Something went wrong!");
    }
  }
}

export default function* watchProfile() {
  yield takeEvery(getOrders().type, getOrdersSaga);
  yield takeEvery(getDesigns().type, getDesignSaga);
  yield takeEvery(retrieveOrderConfirmation().type, getOrderConfirmationSaga);
}
