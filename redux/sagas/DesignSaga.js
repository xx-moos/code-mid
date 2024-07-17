import { toast } from "react-toastify";
import { takeEvery, call, put, select } from "redux-saga/effects";

import {
  postDesign as postDesignAPI,
  getDesign,
  deleteDesign as deleteDesignAPI,
} from "services/DesignerService";

import Design from "redux/models/Design";
import Profile from "redux/models/Profile";

const { create, deleteDesign, postDesign, retrieveDesign } = Design.types;
const { updateProfile } = Profile.types;

function* getDesignSaga(action) {
  try {
    const { designId, cb } = action.payload;
    const design = yield call(getDesign, designId);

    yield put(create(design));
    if (cb) cb(design);
  } catch (err) {
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* postDesignSaga(action) {
  try {
    const { shape, name } = action.payload;
    const design = yield call(postDesignAPI, { shape, name });

    yield put(create(design));
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.non_field_errors)
      toast.error(err?.response?.data?.non_field_errors[0]);
    else toast.error("Something went wrong!");
  }
}

function* deleteDesignSaga(action) {
  try {
    const { id } = action.payload;
    const state = yield select();
    const designs = yield call(deleteDesignAPI, id);

    const profile = state.Profile.itemsById[0];

    yield put(
      updateProfile({
        ...profile,
        designs: designs,
      })
    );

    toast.success("Design Deleted");
  } catch (err) {
    console.log(err);
    toast.error(err?.message || "Something went wrong!");
  }
}

export default function* watchApp() {
  yield takeEvery(retrieveDesign().type, getDesignSaga);
  yield takeEvery(postDesign().type, postDesignSaga);
  yield takeEvery(deleteDesign().type, deleteDesignSaga);
}
