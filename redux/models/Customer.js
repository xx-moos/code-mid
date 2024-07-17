import {
  CHECKOUT_ADDRESS,
  PROFILE_ADDRESS,
  SAMPLES_ADDRESS,
} from "constants/address_form_domains";
import { Model, attr } from "redux-orm";

class Customer extends Model {
  static modelName = "Customer";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      user: attr(),
      token: attr(),
      customer_id: attr(),
      store: attr(),
      email: attr(),
      name: attr(),
      company: attr(),
      notify: attr(),
      locations: attr({ getDefault: () => [] }),
      selectedLocation: attr({
        getDefault: () => ({
          [CHECKOUT_ADDRESS]: undefined,
          [SAMPLES_ADDRESS]: undefined,
          [PROFILE_ADDRESS]: undefined,
        }),
      }),
      cards: attr({ getDefault: () => [] }),
    };
  }

  static types = {
    retrieveCustomerDetail: (payload) => ({
      type: "CUSTOMER/GET_DETAILS",
      payload,
    }),
    update: (payload) => ({
      type: "CUSTOMER/UPDATE",
      payload,
    }),
    updateCustomerDetail: (payload) => ({
      type: "CUSTOMER/UPDATE_DETAILS",
      payload,
    }),
    addLocation: (payload) => ({
      type: "CUSTOMER/ADD_LOCATION",
      payload,
    }),
    updateLocation: (payload) => ({
      type: "CUSTOMER/UPDATE_LOCATION",
      payload,
    }),
    updatePassword: (payload) => ({
      type: "CUSTOMER/UPDATE_PASSWORD",
      payload,
    }),
    delete: (payload) => ({
      type: "CUSTOMER/DELETE",
      payload,
    }),
    deleteLocation: (payload) => ({
      type: "CUSTOMER/DELETE_LOCATION",
      payload,
    }),
    selectLocation: (payload) => ({
      type: "CUSTOMER/SELECT_LOCATION",
      payload,
    }),
    selectPreviewLocation: (payload) => ({
      type: "CUSTOMER/SELECT_PREVIEW_LOCATION",
      payload,
    }),
  };

  static reducer(action, Customer, session) {
    const customer = Customer.all().first() || Customer.create({});

    switch (action.type) {
      case this.types.update().type:
        customer.update({ ...action.payload });
        break;
      case this.types.delete().type:
        Customer.delete();
        Customer.create({});
        break;
    }
  }

  static selectors = {
    getCustomer: (state) => state.Customer.itemsById[0],
    getCustomerSelectedLocation: (state, domain = CHECKOUT_ADDRESS) =>
      state.Customer.itemsById[0]?.selectedLocation?.[domain],
    getCustomerLocations: (state) => state.Customer.itemsById[0]?.locations,
  };
}

export default Customer;
