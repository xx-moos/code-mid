import { createStore as createReduxStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "@redux-devtools/extension";

import rootReducer from "./RootReducer";
import rootSaga from "./sagas/RootSaga";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createReduxStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  persistStore(store);

  return store;
};

export const wrapper = createWrapper(createStore);
