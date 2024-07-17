import { Model, attr } from "redux-orm";

class Checkout extends Model {
  static modelName = "Checkout";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      shapes: attr({ getDefault: () => [] }),
      scents: attr({ getDefault: () => [] }),
      customShape: attr(),
      strings: attr({ getDefault: () => [] }),
      rushList: attr({ getDefault: () => [] }),
      selectedPreviewShipping: attr(),
      previewShippingQuotes: attr({ getDefault: () => {} }),
      shippingQuotes: attr(),
      selectedLocation: attr(),
      currentStep: attr({ getDefault: () => 1 }),
      selectedShape: attr(),
      selectedDesign: attr(),
      selectedCard: attr(),
      customCropType: attr({ getDefault: () => "" }),
      completeOrderLoading: attr({ getDefault: () => false }),
      loadingOrderShippingAndRush: attr({ getDefault: () => false }),
    };
  }

  static types = {
    getShapes: (payload) => ({
      type: "CHECKOUT/GET_SHAPES",
      payload,
    }),
    getScents: (payload) => ({
      type: "CHECKOUT/GET_SCENTS",
      payload,
    }),
    getRushList: (payload) => ({
      type: "CHECKOUT/GET_RUSH",
      payload,
    }),
    getStrings: (payload) => ({
      type: "CHECKOUT/GET_STRINGS",
      payload,
    }),
    updateCheckout: (payload) => ({
      type: "CHECKOUT/UPDATE",
      payload,
    }),

    selectShape: (payload) => ({
      type: "CHECKOUT/SELECT_SHAPE",
      payload,
    }),
    selectRush: (payload) => ({
      type: "CHECKOUT/SELECT_RUSH",
      payload,
    }),
    addCard: (payload) => ({
      type: "CHECKOUT/ADD_CARD",
      payload,
    }),
    updateCard: (payload) => ({
      type: "CHECKOUT/UPDATE_CARD",
      payload,
    }),
    deleteCard: (payload) => ({
      type: "CHECKOUT/DELETE_CARD",
      payload,
    }),
    selectDesign: (payload) => ({
      type: "CHECKOUT/SELECT_DESIGN",
      payload,
    }),
    applyCouponCode: (payload) => ({
      type: "CHECKOUT/APPLY_COUPON",
      payload,
    }),
    removeCouponCode: (payload) => ({
      type: "CHECKOUT/REMOVE_COUPON",
      payload,
    }),
    updateShipmentRate: (payload) => ({
      type: "CHECKOUT/UPDATE_SHIPMENT_RATE",
      payload,
    }),
    selectCard: (payload) => ({
      type: "CHECKOUT/SELECT_CARD",
      payload,
    }),
    checkoutOrder: (payload) => ({
      type: "CHECKOUT/CHECKOUT",
      payload,
    }),
    clearAll: (payload) => ({
      type: "CHECKOUT/CLEAR_ALL",
      payload,
    }),
    initCheckoutDesignReorder: (payload) => ({
      type: "CHECKOUT/DESIGN_REORDER",
      payload,
    }),
    addDesignToOrder: (payload) => ({
      type: "CHECKOUT/ADD_OLD_DESIGN_CUSTOM",
      payload,
    }),
    reorderPreDefinedShape: (payload) => ({
      type: "CHECKOUT/REORDER_PRE_DEFINED",
      payload,
    }),
    createShipment: (payload) => ({
      type: "CHECKOUT/CREATE_SHIPMENT",
      payload,
    }),
    fetchPreviewRates: (payload) => ({
      type: "CHECKOUT/FETCH_PREVIEW_RATES",
      payload,
    }),
    refreshShipmentRates: (payload) => ({
      type: "CHECKOUT/REFRESH_SHIPMENT_RATES",
      payload,
    }),
  };

  static reducer(action, Checkout, session) {
    const checkoutPage = Checkout.all().first() || Checkout.create({});

    switch (action.type) {
      case this.types.updateCheckout().type:
        checkoutPage.update({ ...action.payload });
        break;
      case this.types.selectShape().type:
        checkoutPage.update({ selectedShape: action.payload });
        break;
      case this.types.selectDesign().type:
        checkoutPage.update({ selectedDesign: action.payload });
        break;
      case this.types.selectCard().type:
        checkoutPage.update({ selectedCard: action.payload });
        break;
      case this.types.clearAll().type:
        Checkout.delete();
        Checkout.create({});
        break;
    }
  }

  static selectors = {
    getShapesList: (state) => state.Checkout.itemsById[0]?.shapes,
    getShapesAttributeObject: (state) =>
      [
        ...state.Checkout.itemsById[0]?.shapes,
        state.Checkout.itemsById[0]?.customShape,
      ].reduce((a, v) => ({ ...a, [v?.attribute_id]: v }), {}),
    getCustomShape: (state) => state.Checkout.itemsById[0]?.customShape,
    getScentsList: (state) => state.Checkout.itemsById[0]?.scents,
    getShippingQuotes: (state) => state.Checkout.itemsById[0]?.shippingQuotes,
    getSelectedPreviewShipping: (state) =>
      state.Checkout.itemsById[0]?.selectedPreviewShipping,
    getSelectedShape: (state) => state.Checkout.itemsById[0]?.selectedShape,
    getSelectedDesign: (state) => state.Checkout.itemsById[0]?.selectedDesign,
    getCustomCropType: (state) => state.Checkout.itemsById[0]?.customCropType,
    getStringsList: (state) =>
      Object.values(state.Checkout.itemsById[0]?.strings),
    getRushList: (state) => {
      const rushList = Object.values(state.Checkout.itemsById[0]?.rushList);
      return Array.isArray(rushList) ? rushList : [];
    },
    getPreviewShippingQuotes: (state) =>
      state.Checkout.itemsById[0]?.previewShippingQuotes,
    getShippingQuotesLoading: (state) =>
      state.Checkout.itemsById[0]?.isShippingQuotesLoading,
    getLoadingOrderShippingAndRush: (state) =>
      state.Checkout.itemsById[0]?.loadingOrderShippingAndRush ||
      state.Checkout.itemsById[0]?.isShippingQuotesLoading,
    getSelectedLocation: (state) =>
      state.Checkout.itemsById[0]?.selectedLocation,
    getSelectedCard: (state) =>
      state.Checkout.itemsById[0]?.selectedCard || null,
    getCompleteOrderPaymentLoading: (state) =>
      state.Checkout.itemsById[0]?.completeOrderLoading,
  };
}

export default Checkout;
