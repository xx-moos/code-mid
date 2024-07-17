import { Model, attr } from "redux-orm";

class Items extends Model {
  static modelName = "Items";

  static get fields() {
    return {
      id: attr(),
    };
  }

  static types = {
    createItem: (payload) => ({
      type: "ITEMS/CREATE",
      payload,
    }),
    postItems: (payload) => ({
      type: "ITEMS/POST",
      payload,
    }),
    retrieveItems: (payload) => ({
      type: "ITEMS/GET",
      payload,
    }),
    updateItem: (payload) => ({
      type: "ITEMS/PATCH",
      payload,
    }),
    deleteItems: (payload) => ({
      type: "ITEMS/DELETE",
      payload,
    }),
    clear: (payload) => ({
      type: "ITEMS/CLEAR",
      payload,
    }),
  };

  static reducer(action, Items, session) {
    switch (action.type) {
      case this.types.createItem().type:
        Items.create({ ...action.payload });
        break;
      case this.types.postItems().type:
        break;
      case this.types.clear().type:
        Items.delete();
        break;
    }
  }

  static selectors = {
    getItemsList: (state) => Object.values(state.Items.itemsById),
  };
}

export default Items;
