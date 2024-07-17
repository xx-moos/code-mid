import { Model, attr } from "redux-orm";
import { v4 as uuidv4 } from "uuid";

class Sample extends Model {
  static modelName = "Sample";

  static get fields() {
    return {
      id: attr({ getDefault: () => uuidv4() }),
      orderId: attr(),
      shippingQuote: attr(),
      price: attr({
        getDefault: () => ({ shipping: "0.00", tax: "0.00", total: "0.00" }),
      }),
      street1: attr({ getDefault: () => "" }),
      street2: attr({ getDefault: () => "" }),
      city: attr({ getDefault: () => "" }),
      state: attr({ getDefault: () => "" }),
      country: attr({ getDefault: () => "" }),
      postal_code: attr({ getDefault: () => "" }),
      name: attr({ getDefault: () => "" }),
      company: attr({ getDefault: () => "" }),
      phone: attr({ getDefault: () => "" }),
      email: attr({ getDefault: () => "" }),
    };
  }

  static types = {
    addShippingInfo: (payload) => ({
      type: "SAMPLE/ADD_SHIPPING_INFO",
      payload,
    }),
    selectShippingQuote: (payload) => ({
      type: "SAMPLE/SELECT_SHIPPING_QUOTE",
      payload,
    }),
    setOrderId: (payload) => ({
      type: "SAMPLE/SET_ORDER_ID",
      payload,
    }),
    clear: (payload) => ({
      type: "SAMPLE/CLEAR",
      payload,
    }),
  };

  static reducer(action, Sample, session) {
    const sample = Sample.all().first() || Sample.create({});

    switch (action.type) {
      case "SAMPLE/ADD_SHIPPING_INFO":
        sample.update({
          shippingQuote: undefined,
          price: { shipping: "0.00", tax: "0.00", total: "0.00" },
          ...action.payload,
        });
        break;
      case "SAMPLE/SELECT_SHIPPING_QUOTE":
        sample.update({
          shippingQuote: action.payload?.shippingQuote,
          price: {
            shipping: action.payload?.shippingQuote?.total,
            tax: "0.00",
            total: action.payload?.shippingQuote?.total,
          },
        });
        break;
      case "SAMPLE/SET_ORDER_ID":
        sample.update({
          orderId: action.payload?.orderId,
        });
        break;
      case "SAMPLE/CLEAR":
        sample.update({
          orderId: undefined,
          shippingQuote: undefined,
          price: { shipping: "0.00", tax: "0.00", total: "0.00" },
          street1: "",
          street2: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          name: "",
          company: "",
          phone: "",
          email: "",
          address_string: "",
        });
        break;
    }
  }

  static selectors = {
    sample: (state) => Object.values(state.Sample.itemsById)[0],
    shippingQuote: (state) =>
      Object.values(state.Sample.itemsById)[0]?.shippingQuote,
    shippingAddress: (stt) => {
      const {
        street1,
        street2,
        city,
        state,
        country,
        postal_code,
        name,
        company,
        phone,
        email,
      } = Object.values(stt.Sample.itemsById)[0] || {};

      return postal_code
        ? {
            street1,
            street2,
            city,
            state,
            country,
            postal_code,
            name,
            company,
            phone,
            email,
          }
        : {};
    },
    shippingAddressDescription: (stt) => {
      const {
        street1,
        street2,
        city,
        state,
        country,
        postal_code,
        name,
        company,
        phone,
        email,
      } = Object.values(stt.Sample.itemsById)[0] || {};

      return postal_code
        ? {
            address: [street1, street2, city, state, country, postal_code]
              .filter(Boolean)
              .join(", "),
            customer: [name, company, phone, email].filter(Boolean).join(", "),
          }
        : false;
    },
    price: (state) => Object.values(state.Sample.itemsById)[0]?.price,
    orderId: (state) => Object.values(state.Sample.itemsById)[0]?.orderId,
  };
}

export default Sample;
