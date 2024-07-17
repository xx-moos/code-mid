import { toast } from "react-toastify";
import { takeEvery, call, put, select } from "redux-saga/effects";

import {
  deleteCustomerAddress,
  getCustomerDetail,
  patchCustomerDetail,
  postCustomerAddress,
  putCustomerAddress,
  putCustomerPassword,
} from "services/CustomerService";

import Customer from "redux/models/Customer";
import { getApiFirstErrorMessage } from "utils/getApiErrorMessage";
import Checkout from "redux/models/Checkout";
import { trackAddShippingInfo } from "utils/googleTag";
import Order from "redux/models/Order";
import { getAddressByPostalCode } from "services/SamplesService";
import { CHECKOUT_ADDRESS } from "constants/address_form_domains";

const {
  update,
  retrieveCustomerDetail,
  addLocation,
  updateLocation,
  updateCustomerDetail,
  updatePassword,
  deleteLocation,
  selectLocation,
  selectPreviewLocation,
} = Customer.types;

function* getCustomerDetailSaga(action) {
  try {
    const cb = action.payload?.cb;
    const { id, ...user } = yield call(getCustomerDetail);

    yield put(update({ ...user, customer_id: id }));

    if (!!cb) cb(user?.name || "");
  } catch (err) {
    toast.error(getApiFirstErrorMessage(err));
  }
}

function* updateCustomerDetailSaga(action) {
  try {
    const { payload } = action;
    yield call(patchCustomerDetail, payload);
    const state = yield select();
    const user = state.Customer.itemsById[0];
    yield put(
      update({
        ...user,
        ...payload,
      })
    );

    toast.success("Account Updated");
  } catch (err) {
    toast.error(getApiFirstErrorMessage(err));
  }
}

function* addLocationSaga(action) {
  try {
    const { cb, location } = action.payload;
    const customer = yield select(Customer.selectors.getCustomer);
    const order = yield select(Order.selectors.getOrder);
    const resp = yield call(postCustomerAddress, location);

    yield put(
      update({
        locations: [...customer?.locations, resp],
      })
    );

    if (order?.id) trackAddShippingInfo(order, customer);

    if (!!cb) cb(resp);
  } catch (err) {
    toast.error(err?.message || "Something went wrong!");
  }
}

function* updateLocationSaga(action) {
  try {
    const { cb, location } = action.payload;
    const state = yield select();
    const resp = yield call(putCustomerAddress, location, location?.id);

    const customer = state.Customer.itemsById[0];

    toast.success("Address Updated");

    yield put(
      update({
        locations: customer?.locations.map((l) =>
          l.id === location?.id ? resp : l
        ),
      })
    );

    if (!!cb) cb(resp);
  } catch (err) {
    toast.error(err?.message || "Something went wrong!");
  }
}

function* updatePasswordSaga(action) {
  try {
    const { payload } = action;
    const resp = yield call(putCustomerPassword, payload);

    toast.success("Password Updated");
  } catch (err) {
    toast.error(err?.message || "Something went wrong!");
  }
}

function* deleteLocationSaga(action) {
  try {
    const { cb, location } = action.payload;

    const newLocations = yield call(deleteCustomerAddress, location.id);

    const selectedLocation =
      newLocations.find((l) => l.default) || newLocations[0];

    yield put(update({ locations: newLocations }));

    if (!!cb) cb(selectedLocation);

    toast.success("Address Deleted");
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
  }
}

function* selectLocationSaga(action) {
  try {
    const { location, cb, domain } = action.payload;

    const locations = yield select(Customer.selectors.getCustomerLocations);
    const customer = yield select(Customer.selectors.getCustomer);
    const order = yield select(Order.selectors.getOrder);

    yield put(
      update({
        selectedLocation: {
          ...customer?.selectedLocation,
          [domain || CHECKOUT_ADDRESS]: location,
        },
      })
    );

    if (!location?.id) {
      const newSelectedLocation =
        locations.find((l) => l.default) || locations[0];
      if (newSelectedLocation)
        yield put(selectLocation({ location: newSelectedLocation, domain }));

      if (!!cb) cb();

      return;
    }

    if (order?.id && domain === CHECKOUT_ADDRESS)
      yield put(Checkout.types.createShipment({ location }));

    if (!!cb) cb();
  } catch (err) {
    console.error(err);

    toast.error(err?.message || "Something went wrong!");
  }
}

function* selectPreviewLocationSaga(action) {
  try {
    // if postal code exist on the locations list - select location
    // Else if create preview

    const { postal_code, cb } = action.payload;

    const locations = yield select(Customer.selectors.getCustomerLocations);
    const customer = yield select(Customer.selectors.getCustomer);

    const locationFound = locations?.find(
      (loc) => loc.postal_code === postal_code
    );
    if (locationFound?.id) {
      yield put(
        selectLocation({ location: locationFound, domain: CHECKOUT_ADDRESS })
      );
    } else {
      yield put(
        Checkout.types.updateCheckout({ isShippingQuotesLoading: true })
      );
      const newAddress = yield call(getAddressByPostalCode, postal_code);

      yield put(
        update({
          selectedLocation: {
            ...customer?.selectedLocation,
            [CHECKOUT_ADDRESS]: { ...newAddress, is_preview: true },
          },
        })
      );

      yield put(Checkout.types.fetchPreviewRates({ location: newAddress }));
    }

    if (!!cb) cb();
  } catch (err) {
    yield put(
      Checkout.types.updateCheckout({ isShippingQuotesLoading: false })
    );

    toast.error(err?.message || "Something went wrong!");
  }
}

export default function* watchApp() {
  yield takeEvery(updateCustomerDetail().type, updateCustomerDetailSaga);
  yield takeEvery(retrieveCustomerDetail().type, getCustomerDetailSaga);
  yield takeEvery(addLocation().type, addLocationSaga);
  yield takeEvery(updateLocation().type, updateLocationSaga);
  yield takeEvery(updatePassword().type, updatePasswordSaga);
  yield takeEvery(deleteLocation().type, deleteLocationSaga);
  yield takeEvery(selectLocation().type, selectLocationSaga);
  yield takeEvery(selectPreviewLocation().type, selectPreviewLocationSaga);
}
