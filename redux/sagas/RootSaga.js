import { all, fork } from "redux-saga/effects";
import watchCheckout from "redux/sagas/CheckoutSaga";
import watchStage from "redux/sagas/StageSaga";
import watchSamplesForm from "redux/sagas/SamplesFormSaga";
import watchApp from "redux/sagas/AppSaga";
import watchCustomer from "redux/sagas/CustomerSaga";
import watchOrder from "redux/sagas/OrderSaga";
import watchDesign from "redux/sagas/DesignSaga";
import watchProfile from "redux/sagas/ProfileSaga";
import watchCustomShape from "redux/sagas/CustomShapeSaga";
import watchLassoShape from "redux/sagas/LassoShapeSaga";

export default function* rootSaga() {
  yield all([
    fork(watchStage),
    fork(watchCheckout),
    fork(watchSamplesForm),
    fork(watchApp),
    fork(watchCustomer),
    fork(watchOrder),
    fork(watchDesign),
    fork(watchProfile),
    fork(watchCustomShape),
    fork(watchLassoShape),
  ]);
}
