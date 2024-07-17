import { Model, attr } from "redux-orm";

class SamplesForm extends Model {
  static modelName = "SamplesForm";

  static get fields() {
    return {
      shippingQuotes: attr({ getDefault: () => [] }),
      countries: attr({ getDefault: () => [] }),
      states: attr({ getDefault: () => [] }),
      isLoading: attr({ getDefault: () => false }),
      isEditing: attr({ getDefault: () => true }),
      error: attr({ getDefault: () => null }),
    };
  }

  static types = {
    getShippingQuotes: (payload) => ({
      type: "SAMPLES_FORM/GET_SHIPPING_QUOTES",
      payload,
    }),
    setShippingQuotes: (payload) => ({
      type: "SAMPLES_FORM/SET_SHIPPING_QUOTES",
      payload,
    }),
    getStates: (payload) => ({ type: "SAMPLES_FORM/GET_STATES", payload }),
    setStates: (payload) => ({ type: "SAMPLES_FORM/SET_STATES", payload }),
    setCountries: (payload) => ({
      type: "SAMPLES_FORM/SET_COUNTRIES",
      payload,
    }),
    error: (payload) => ({ type: "SAMPLES_FORM/ERROR", payload }),
    placeOrder: (payload) => ({ type: "SAMPLES_FORM/PLACE_ORDER", payload }),
    stopLoading: (payload) => ({ type: "SAMPLES_FORM/STOP_LOADING", payload }),
    setIsEditing: (payload) => ({ type: "SAMPLES_FORM/SET_EDITING", payload }),
  };

  static reducer(action, SamplesForm, session) {
    const samplesForm = SamplesForm.all().first() || SamplesForm.create({});

    switch (action.type) {
      case this.types.getShippingQuotes().type:
        samplesForm.update({ isLoading: true });
        break;
      case this.types.setShippingQuotes().type:
        samplesForm.update({
          shippingQuotes: action.payload?.shippingQuotes,
          isLoading: false,
          error: null,
        });
        break;
      case this.types.getStates().type:
        samplesForm.update({ isLoading: true });
        break;
      case this.types.setStates().type:
        samplesForm.update({
          states: action.payload?.states,
          isLoading: false,
          error: null,
        });
        break;
      case this.types.setCountries().type:
        samplesForm.update({
          countries: action.payload?.countries,
          isLoading: false,
          error: null,
        });
        break;
      case this.types.error().type:
        samplesForm.update({
          error: action?.payload?.message || "Something went wrong!",
          isLoading: false,
        });
        break;
      case this.types.placeOrder().type:
        samplesForm.update({ isLoading: true });
        break;
      case this.types.stopLoading().type:
        samplesForm.update({ isLoading: false });
        break;
      case this.types.setIsEditing().type:
        samplesForm.update({ isEditing: action.payload });
        break;
    }
  }

  static selectors = {
    getCountriesList: (state) => state.SamplesForm.itemsById[0]?.countries,
    getStatesList: (state) => state.SamplesForm.itemsById[0]?.states,
    isLoading: (state) => state.SamplesForm.itemsById[0]?.isLoading,
    isEditing: (state) => state.SamplesForm.itemsById[0]?.isEditing,
    getShippingQuotesList: (state) =>
      state.SamplesForm.itemsById[0]?.shippingQuotes,
  };
}

export default SamplesForm;
