import { toast } from "react-toastify";
import { takeEvery, call, put, select } from "redux-saga/effects";

import {
  getCountryStatesList,
  getShippingQuotesList,
  purchaseSample,
} from "services/SamplesService";

import SamplesForm from "redux/models/SamplesForm";
import Sample from "redux/models/Sample";
import Customer from "redux/models/Customer";

const {
  error,
  setShippingQuotes,
  setStates,
  getShippingQuotes,
  getStates,
  placeOrder,
  stopLoading,
  setIsEditing,
} = SamplesForm.types;

const { addShippingInfo, setOrderId } = Sample.types;

function* getShippingQuotesSaga(action) {
  try {
    const {
      company,
      email,
      name,
      city,
      country,
      phone,
      postal_code,
      state,
      street1,
      street2,
    } = action.payload;

    const {
      email: CustomerEmail,
      name: CustomerName,
      company: CustomerCompany,
    } = yield select(Customer.selectors.getCustomer);

    const shippingQuotes = yield call(getShippingQuotesList, {
      company: company || CustomerCompany,
      name: name || CustomerName,
      email: email || CustomerEmail,
      phone,
      city,
      country,
      postal_code,
      state,
      street1,
      street2,
    });

    if (!shippingQuotes.length) {
      throw new Error(
        "Invalid Address: Please review the provided information"
      );
    }

    yield put(
      setShippingQuotes({
        shippingQuotes,
      })
    );
    yield put(
      addShippingInfo({
        company: company || CustomerCompany,
        name: name || CustomerName,
        email: email || CustomerEmail,
        city,
        country,
        phone,
        postal_code,
        state,
        street1,
        street2,
        address_string: [street1, street2, city, country, state, postal_code]
          .filter(Boolean)
          .join(", "),
      })
    );
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    yield put(error({ message: err.message }));
    yield put(setShippingQuotes({ shippingQuotes: [] }));
  } finally {
    const { cb } = action.payload;
    if (cb) cb();
  }
}

function* getStatesSaga(action) {
  try {
    const { countryAbbr } = action.payload;
    const states = yield call(getCountryStatesList, countryAbbr);
    yield put(setStates({ states }));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    yield put(error({ message: err.message }));
    yield put(setStates({ states: [] }));
  }
}

function* placeOrderSaga(action) {
  try {
    const { cardElement, stripe } = action.payload;
    const sample = yield select(Sample.selectors.sample);

    const tokenInfo = yield call(stripe.createToken, cardElement);

    if (tokenInfo.hasOwnProperty("error")) {
      toast.error(tokenInfo.error.message || "Something went wrong!");
      yield put(error({ message: tokenInfo.error.message }));
      return;
    }

    const resp = yield call(purchaseSample, {
      name: sample.name,
      company: sample.company,
      email: sample.email,
      phone: sample.phone,
      street1: sample.street1,
      city: sample.city,
      postal_code: sample.postal_code,
      country: sample.country,
      state: sample.state,
      state: sample.state,
      rate_id: sample.shippingQuote.rate_id,
      provider: sample.shippingQuote.provider,
      service: sample.shippingQuote.service,
      total: sample.shippingQuote.total,
      token: tokenInfo.token.id,
    });

    if (resp.hasOwnProperty("error")) {
      toast.error(resp.error || "Something went wrong!");
      yield put(error({ message: resp.error }));
      return;
    }

    yield put(setOrderId({ orderId: resp.id }));
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    yield put(error({ message: err.message }));
  } finally {
    if (process.env.NODE_ENV === "development") yield put(stopLoading());
  }
}

function* setIsEditingSaga(action) {
  try {
    const isEditing = action.payload;

    if (isEditing) {
      yield put(setShippingQuotes({ shippingQuotes: [] }));
      yield put(addShippingInfo({}));
    }
  } catch {}
}

export default function* watchSamplesForm() {
  yield takeEvery(getShippingQuotes().type, getShippingQuotesSaga);
  yield takeEvery(getStates().type, getStatesSaga);
  yield takeEvery(placeOrder().type, placeOrderSaga);
  yield takeEvery(setIsEditing().type, setIsEditingSaga);
}
