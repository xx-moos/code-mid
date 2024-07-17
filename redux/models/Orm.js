import { ORM } from "redux-orm";
import Checkout from "redux/models/Checkout";
import Stage from "./Stage";
import App from "./App";
import Sample from "./Sample";
import SamplesForm from "./SamplesForm";
import Customer from "./Customer";
import Order from "./Order";
import Design from "./Design";
import Items from "./Items";
import Profile from "./Profile";
import CustomShape from "./CustomShape";
import LassoShape from "./LassoShape";

const orm = new ORM({
  stateSelector: (state) => state.orm,
});

orm.register(
  Checkout,
  Stage,
  App,
  Sample,
  SamplesForm,
  Customer,
  Order,
  Design,
  Profile,
  Items,
  CustomShape,
  LassoShape
);

export default orm;
