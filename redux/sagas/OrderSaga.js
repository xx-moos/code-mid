import { toast } from "react-toastify";
import { takeEvery, call, put, select } from "redux-saga/effects";

import {
  getOrderItems,
  createOrder,
  createOrderItem,
  putOrderItem,
  deleteOrderItem,
  setOrderApproval,
  setOrderRejection,
  attachOrderToCustomer,
  getMostRecenteUncompletedOrder,
} from "services/OrderService";

import Order from "redux/models/Order";
import Items from "redux/models/Items";
import Design from "redux/models/Design";
import Checkout from "redux/models/Checkout";
import Customer from "redux/models/Customer";
import {
  CHECKOUT_ADDRESS,
  PROFILE_ADDRESS,
  SAMPLES_ADDRESS,
} from "constants/address_form_domains";

const { updateItem, postItems, deleteItems } = Items.types;
const {
  create,
  postOrder,
  retrieveOrder,
  approveOrder,
  rejectOrder,
  attachToCustomer,
  getRecentUncompletedOrder,
  clear,
} = Order.types;

function* getOrderSaga(action) {
  try {
    const { orderId, cb } = action.payload;
    const order = yield call(getOrderItems, orderId);
    yield put(create(order));

    if (cb) cb(order);
  } catch (err) {
    if (
      err?.response?.data?.detail ===
      "You do not have permission to perform this action."
    ) {
      yield put(Order.types.clear());
      window.location.replace("/");
    } else {
      if (err?.response?.data?.non_field_errors)
        toast.error(err?.response?.data?.non_field_errors[0]);
      else toast.error("Something went wrong!");
    }
  }
}

function* postOrderSaga(action) {
  try {
    const { design } = action.payload;
    const order = yield call(createOrder, { design });

    yield put(create({ ...order, id: order.pk }));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* getRecentUncompletedOrderSaga(action) {
  try {
    const order = yield call(getMostRecenteUncompletedOrder);
    if (!order?.id) return;

    yield put(retrieveOrder({ orderId: order.id }));

    if (action?.payload?.cb) action?.payload?.cb(order?.id);
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* postItemSaga(action) {
  try {
    const { attributes, quantity, description, cb } = action.payload;
    const { Order, Checkout } = yield select();
    const order = Order.itemsById[Order.items[0]];

    const item = yield call(createOrderItem, {
      order: order.id,
      design: { id: Checkout.itemsById[0].selectedDesign },
      attributes,
      quantity,
      description,
    });

    yield put(retrieveOrder({ orderId: order.id }));

    if (cb) cb();
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  } finally {
    action.payload?.finallyCb?.();
  }
}

function* deleteItemSaga(action) {
  try {
    const selectedPreview = yield select(
      Checkout.selectors.getSelectedPreviewShipping
    );
    const shippingQuotes = yield select(Checkout.selectors.getShippingQuotes);
    yield put(
      Checkout.types.updateCheckout({
        selectedPreviewShipping: selectedPreview && {
          ...selectedPreview,
          option: null,
        },
      })
    );
    const { id, callback } = action.payload;
    const { Order } = yield select();
    const order = Order.itemsById[Order.items[0]];

    yield call(deleteOrderItem, { id });

    const newOrder = yield call(getOrderItems, order.id);

    yield put(create(newOrder));

    if (callback) callback(newOrder);
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* updateItemSaga(action) {
  try {
    const { attributes, quantity, description, id, cb } = action.payload;
    const { Order } = yield select();
    const order = Order.itemsById[Order.items[0]];

    yield call(putOrderItem, {
      id,
      attributes,
      quantity,
      description,
    });

    yield put(retrieveOrder({ orderId: order.id, cb }));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* attachToCustomerSaga(action) {
  try {
    const { Order } = yield select();
    const order = Order.itemsById[Order.items[0]];
    const [design] = yield select(Design.selectors.getDesignsIdsList);

    yield call(attachOrderToCustomer, order.id, design);

    yield put(retrieveOrder({ orderId: order.id }));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* approveOrderSaga(action) {
  try {
    const { order } = action.payload;

    const { Customer } = yield select();
    const customer = Customer.itemsById[Customer.items[0]];

    if (customer?.customer_id && order?.status !== "approved")
      yield call(setOrderApproval, order.id);

    yield put(retrieveOrder({ orderId: order.id }));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* rejectOrderSaga(action) {
  try {
    const { order } = action.payload;

    const { Customer } = yield select();
    const customer = Customer.itemsById[Customer.items[0]];

    if (customer?.customer_id) yield call(setOrderRejection, order.id);

    yield put(retrieveOrder({ orderId: order.id }));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* clearOrderSaga() {
  try {
    yield put(
      Customer.types.update({
        selectedLocation: {
          [CHECKOUT_ADDRESS]: undefined,
          [SAMPLES_ADDRESS]: undefined,
          [PROFILE_ADDRESS]: undefined,
        },
      })
    );
    yield put(
      Checkout.types.updateCheckout({
        selectedPreviewShipping: {},
        shippingQuotes: {},
        previewShippingQuotes: {},
      })
    );
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

export default function* watchApp() {
  yield takeEvery(retrieveOrder().type, getOrderSaga);
  yield takeEvery(postOrder().type, postOrderSaga);
  yield takeEvery(postItems().type, postItemSaga);
  yield takeEvery(deleteItems().type, deleteItemSaga);
  yield takeEvery(updateItem().type, updateItemSaga);
  yield takeEvery(approveOrder().type, approveOrderSaga);
  yield takeEvery(rejectOrder().type, rejectOrderSaga);
  yield takeEvery(attachToCustomer().type, attachToCustomerSaga);
  yield takeEvery(clear().type, clearOrderSaga);
  yield takeEvery(
    getRecentUncompletedOrder().type,
    getRecentUncompletedOrderSaga
  );
}
