import { toast } from "react-toastify";
import { takeEvery, call } from "redux-saga/effects";

import { sendResetPasswordEmail as sendEmail } from "services/AuthService";

import App from "redux/models/App";
import { postReview } from "services/AppService";

const { sendResetPasswordEmail, sendReview } = App.types;

function* sendResetPasswordEmailSaga(action) {
  try {
    const { email } = action.payload;
    yield call(sendEmail, { email });

    toast.success("Email sent! Check your inbox");
  } catch (err) {
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* sendReviewSaga(action) {
  try {
    const { rating, review, review_token, image, cb } = action.payload;

    // generate file from base64 string
    // const file = dataURLtoFile(image, `review-${review_id}.png`);

    yield call(postReview, {
      image,
      rating,
      review,
      request_id: review_token,
    });

    if (cb) cb(true);
    toast.success("Thanks for your review!");
  } catch (err) {
    const { cb } = action.payload;
    if (cb) cb(false);

    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

export default function* watchApp() {
  yield takeEvery(sendResetPasswordEmail().type, sendResetPasswordEmailSaga);
  yield takeEvery(sendReview().type, sendReviewSaga);
}
