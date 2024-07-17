import { Model, attr } from "redux-orm";

class Profile extends Model {
  static modelName = "Profile";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      designs: attr({ getDefault: () => [] }),
      orders: attr({ getDefault: () => [] }),
      selectedOrder: attr(),
    };
  }

  static types = {
    updateProfile: (payload) => ({
      type: "PROFILE/UPDATE",
      payload,
    }),
    getOrders: (payload) => ({
      type: "PROFILE/GET_ORDERS",
      payload,
    }),
    getDesigns: (payload) => ({
      type: "PROFILE/GET_DESIGNS",
      payload,
    }),
    selectOrder: (payload) => ({
      type: "PROFILE/SELECT_ORDER",
      payload,
    }),
    retrieveOrderConfirmation: (payload) => ({
      type: "PROFILE/ORDER_CONFIRMATION",
      payload,
    }),
    delete: (payload) => ({
      type: "PROFILE/DELETE",
      payload,
    }),
  };

  static reducer(action, Profile, session) {
    const profilePage = Profile.all().first() || Profile.create({});

    switch (action.type) {
      case this.types.updateProfile().type:
        profilePage.update({ ...action.payload });
        break;
      case this.types.selectOrder().type:
        profilePage.update({ selectedOrder: action.payload });
        break;
        case this.types.delete().type:
        profilePage.delete();
        break;
    }
  }

  static selectors = {
    getDesignsList: (state) => state.Profile.itemsById[0]?.designs,
    getOrdersList: (state) => state.Profile.itemsById[0]?.orders,
    getSelectedOrder: (state) => state.Profile.itemsById[0]?.selectedOrder,
  };
}

export default Profile;
