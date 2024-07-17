import { HYDRATE } from "next-redux-wrapper";
import { createReducer } from "redux-orm";
import orm from "./models/Orm";

const ormReducer = createReducer(orm);

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  } else {
    return ormReducer(state, action);
  }
};

export default reducer;
