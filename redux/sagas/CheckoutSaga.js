import { toast } from "react-toastify";
import { takeEvery, call, put, select, all, takeLatest } from "redux-saga/effects";

import {
  getScentsList,
  getShapesList,
  getStringsList,
  createCustomerCard,
  putCustomerCard,
  deleteCustomerCard,
  putShipmentRate,
  postShipment,
  createShippingRatesPreview,
  retrieveShippingRatesPreview,
} from "services/CheckoutService";

import { getDesign, postDesignReorder } from "services/DesignerService";

import Customer from "redux/models/Customer";
import Checkout from "redux/models/Checkout";
import Order from "redux/models/Order";
import Design from "redux/models/Design";
import CustomShape from "redux/models/CustomShape";
import Profile from "redux/models/Profile";
import Items from "redux/models/Items";

import {
  getOrderRushOptions,
  putOrderRushOption,
  putOrderCouponCode,
  checkout,
  removeOrderCouponCode,
} from "services/OrderService";
import {
  applyPreviewShipping,
  fetchCheckoutShippingQuotes,
} from "services/ShippingService";

const { update } = Customer.types;
const {
  getShapes,
  getScents,
  updateCheckout,
  getStrings,
  addCard,
  updateCard,
  deleteCard,
  getRushList,
  selectRush,
  applyCouponCode,
  removeCouponCode,
  updateShipmentRate,
  checkoutOrder,
  clearAll,
  initCheckoutDesignReorder,
  addDesignToOrder,
  reorderPreDefinedShape,
  createShipment,
  fetchPreviewRates,
  refreshShipmentRates,
} = Checkout.types;

function* getShapesSaga(action) {
  try {
    const shapes = yield call(getShapesList);

    yield put(
      updateCheckout({
        shapes: shapes.filter((shape) => !shape.slug.includes("custom")),
        customShape: shapes.find((shape) => shape.slug.includes("custom")),
      })
    );
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* getScentsSaga(action) {
  try {
    const scents = yield call(getScentsList);
    yield put(updateCheckout({ scents }));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* getStringsSaga(action) {
  try {
    const strings = yield call(getStringsList);
    yield put(updateCheckout({ strings }));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* addCardSaga(action) {
  try {
    const { onSuccess, onError, cardElement, stripe, ...cardData } =
      action.payload;

    const state = yield select();
    const user = state.Customer.itemsById[0];
    const result = yield call(stripe.createPaymentMethod, {
      type: "card",
      card: cardElement,
    });

    if (result.hasOwnProperty("error")) {
      toast.error(result.error.message || "Something went wrong!");
      if (!!onError) onError();

      return;
    }

    const resp = yield call(createCustomerCard, {
      ...cardData,
      payment_method_id: result.paymentMethod.id,
    });

    yield put(
      update({
        ...user,
        customer_id: user.id,
        cards: [...user?.cards, resp],
      })
    );

    if (!!onSuccess) onSuccess(resp);
  } catch (err) {
    const { onError } = action.payload;
    if (!!onError) onError();

    toast.error(err.message || "Something went wrong!");
  }
}

function* updateCardSaga(action) {
  try {
    const { onSuccess, cardId, ...cardData } = action.payload;
    const state = yield select();
    const user = state.Customer.itemsById[0];
    const resp = yield call(putCustomerCard, cardData, cardId);

    yield put(
      update({
        ...user,
        customer_id: user.id,
        cards: [...user?.cards, resp],
      })
    );

    toast.success("Card Updated");

    if (!!onSuccess) onSuccess(resp);
  } catch (err) {
    const { onError } = action.payload;
    if (!!onError) onError();

    toast.error(err.message || "Something went wrong!");
  }
}

function* deleteCardSaga(action) {
  try {
    const { id, cb } = action.payload;
    const state = yield select();
    const resp = yield call(deleteCustomerCard, id);

    const user = state.Customer.itemsById[0];

    yield put(
      update({
        ...user,
        customer_id: user.id,
        cards: resp,
      })
    );

    cb?.(resp);
    toast.success("Card Deleted");
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* getRushListSaga(action) {
  try {
    const order = yield select(Order.selectors.getOrder);
    const rushList = yield call(getOrderRushOptions, order.id);
    yield put(updateCheckout({ rushList }));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* selectRushSaga(action) {
  try {
    const { rush } = action.payload;
    const order = yield select(Order.selectors.getOrder);
    const { items, ...orderUpdated } = yield call(putOrderRushOption, {
      id: order.id,
      rush,
    });

    yield put(Order.types.updateOrder(orderUpdated));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* applyCouponSaga(action) {
  try {
    const { code } = action.payload;
    const order = yield select(Order.selectors.getOrder);
    const { items, ...orderUpdated } = yield call(putOrderCouponCode, {
      id: order.id,
      coupon_code: code,
    });

    yield put(Order.types.updateOrder(orderUpdated));
  } catch (err) {
    const { onError } = action.payload;
    if (onError) onError();
  } finally {
    const { callback } = action.payload;
    if (callback) callback();
  }
}

function* removeCouponSaga(action) {
  try {
    const { code } = action.payload;
    const order = yield select(Order.selectors.getOrder);
    const { items, ...orderUpdated } = yield call(removeOrderCouponCode, {
      id: order.id,
      coupon_code: code,
    });

    yield put(Order.types.updateOrder(orderUpdated));
  } catch (err) {
    const { onError } = action.payload;
    if (onError) onError();
  } finally {
    const { callback } = action.payload;
    if (callback) callback();
  }
}

function* updateShipmentRateSaga(action) {
  try {
    const { shipping_quote, shipping_method } = action.payload;

    const order = yield select(Order.selectors.getOrder);

    const { items, ...orderUpdated } = yield call(putShipmentRate, {
      order_id: order.id,
      shipping_quote,
      shipping_method,
    });

    yield put(Order.types.updateOrder(orderUpdated));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  } finally {
    const { callback } = action.payload;
    if (callback) callback();
  }
}

function* checkoutOrderSaga(action) {
  try {
    const order = yield select(Order.selectors.getOrder);
    // checkout
    const orderDone = yield call(checkout, order.id);

    yield put(Order.types.updateOrder(orderDone));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* clearAllSaga(action) {
  try {
    yield put(Order.types.delete());
    yield put(Design.types.delete());
    yield put(CustomShape.types.delete());
    yield put(Items.types.clear());
    yield put(Customer.types.delete());
    yield put(Profile.types.delete());
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* initCheckoutDesignReorderSaga(action) {
  try {
    const { id, cb } = action.payload;
    const order = yield select(Order.selectors.getOrder);

    if (order?.id) {
      yield put(
        addDesignToOrder({
          id,
          cb,
        })
      );
    } else {
      yield put(
        reorderPreDefinedShape({
          id,
          cb,
        })
      );
    }
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* reorderPreDefinedShapeSaga(action) {
  try {
    const { id, cb } = action.payload;

    const { id: order, design_id: designId } = yield call(
      postDesignReorder,
      id
    );

    yield put(Checkout.types.updateCheckout({ customCropType: "" }));
    yield put(CustomShape.types.delete());
    yield put(Order.types.retrieveOrder({ orderId: order }));

    const design = yield call(getDesign, designId);

    yield put(Checkout.types.selectShape(design.shape.id));
    yield put(Design.types.create(design));

    yield put(Checkout.types.selectDesign(designId));

    toast.success(
      "Don't worry your design is ready for you on the next page! We just need a little information first."
    );

    if (cb) cb(order, designId);
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* addOldDesignToOrderSaga(action) {
  try {
    const { id, cb } = action.payload;
    const order = yield select(Order.selectors.getOrder);

    const design = yield call(getDesign, id);

    yield put(Checkout.types.selectDesign(id));
    yield put(Checkout.types.selectShape(design.shape.id));

    toast.success(
      "Don't worry your design is ready for you on the next page! We just need a little information first."
    );

    if (cb) cb(order.id, id);
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

/**
 * 1- Block the deletion of items
 * 2- Create a shipment to the order and fetch the oficial shipping quotes with retries
 * 3- Apply the preview selected shipping if necessary and
 * 4- Update the order and the checkout properly
 */
function* createShipmentSaga(action) {
  try {
    const { location } = action.payload;

    const { id: orderId } = yield select(Order.selectors.getOrder);
    const previewShipping = yield select(
      Checkout.selectors.getSelectedPreviewShipping
    );

    yield put(
      Checkout.types.updateCheckout({
        isShippingQuotesLoading: true,
        shippingQuotes: {},
        previewShippingQuotes: {},
        selectedPreviewShipping: {},
        selectedLocation: location,
      })
    );

    const { order, rushList } = yield all({
      order: call(postShipment, {
        order_id: orderId,
        location_id: location.id,
      }),
      rushList: call(getOrderRushOptions, orderId),
    });

    yield put(Checkout.types.updateCheckout({ rushList }));

    const quotes = yield fetchCheckoutShippingQuotes(order?.shipments[0]?.id);
    const newOrder = yield applyPreviewShipping(
      previewShipping,
      order,
      quotes,
      rushList
    );

    yield put(Order.types.updateOrder(newOrder || order));
    yield put(
      Checkout.types.updateCheckout({
        shippingQuotes: quotes,
        isShippingQuotesLoading: false,
      })
    );
  } catch (err) {
    yield put(
      Checkout.types.updateCheckout({
        shippingQuotes: undefined,
        isShippingQuotesLoading: false,
      })
    );
    toast.error(err.message || "Something went wrong!");
  }
}

function* fetchPreviewRatesSaga(action) {
  try {
    const { location } = action.payload;

    const { id: orderId } = yield select(Order.selectors.getOrder);

    yield put(Checkout.types.updateCheckout({ isShippingQuotesLoading: true }));

    const preview = yield call(createShippingRatesPreview, {
      postal_code: location.postal_code,
      country: location.country,
    });

    const { rates, rushList } = yield all({
      rates: call(retrieveShippingRatesPreview, {
        order_id: orderId,
        preview_id: preview.id,
      }),
      rushList: call(getOrderRushOptions, orderId),
    });

    yield put(
      Checkout.types.updateCheckout({
        previewShippingQuotes: { rates },
        rushList,
        selectedLocation: null,
        selectedPreviewShipping: { option: null, location },
      })
    );
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  } finally {
    yield put(
      Checkout.types.updateCheckout({
        isShippingQuotesLoading: false,
      })
    );
  }
}

function* refreshShipmentRatesSaga(action) {
  try {
    const location = yield select(
      Customer.selectors.getCustomerSelectedLocation
    );

    if (!location) return;

    if (location?.is_preview)
      yield put(Checkout.types.fetchPreviewRates({ location }));
    else yield put(Checkout.types.createShipment({ location }));
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong!");
  }
}

export default function* watchCheckout() {
  yield takeEvery(getShapes().type, getShapesSaga);
  yield takeEvery(getScents().type, getScentsSaga);
  yield takeEvery(getStrings().type, getStringsSaga);
  yield takeEvery(addCard().type, addCardSaga);
  yield takeEvery(updateCard().type, updateCardSaga);
  yield takeEvery(deleteCard().type, deleteCardSaga);
  yield takeEvery(getRushList().type, getRushListSaga);
  yield takeEvery(selectRush().type, selectRushSaga);
  yield takeEvery(applyCouponCode().type, applyCouponSaga);
  yield takeEvery(removeCouponCode().type, removeCouponSaga);
  yield takeEvery(updateShipmentRate().type, updateShipmentRateSaga);
  yield takeEvery(checkoutOrder().type, checkoutOrderSaga);
  yield takeEvery(clearAll().type, clearAllSaga);
  yield takeEvery(
    initCheckoutDesignReorder().type,
    initCheckoutDesignReorderSaga
  );
  yield takeEvery(reorderPreDefinedShape().type, reorderPreDefinedShapeSaga);
  yield takeEvery(addDesignToOrder().type, addOldDesignToOrderSaga);
  yield takeLatest(createShipment().type, createShipmentSaga);
  yield takeEvery(fetchPreviewRates().type, fetchPreviewRatesSaga);
  yield takeEvery(refreshShipmentRates().type, refreshShipmentRatesSaga);
}
