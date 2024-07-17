import { Model, attr } from "redux-orm";

class Design extends Model {
  static modelName = "Design";

  static get fields() {
    return {
      id: attr(),
    };
  }

  static types = {
    create: (payload) => ({
      type: "DESIGN/CREATE",
      payload,
    }),
    postDesign: (payload) => ({
      type: "DESIGN/POST",
      payload,
    }),
    retrieveDesign: (payload) => ({
      type: "DESIGN/GET",
      payload,
    }),
    deleteDesign: (payload) => ({
      type: "DESIGN/DELETE",
      payload,
    }),
    delete: (payload) => ({
      type: "DESIGN/CLEAR",
      payload,
    }),
  };

  static reducer(action, Design, session) {
    switch (action.type) {
      case this.types.create().type:
        Design.create({ ...action.payload });
        break;
      case this.types.postDesign().type:
        break;
      case this.types.retrieveDesign().type:
        break;
      case this.types.delete().type:
        Design.delete();
        break;
    }
  }

  static selectors = {
    getDesign: (state, id) => state.Design.itemsById[id] || {},
    isDesignArtworkBlank: (state, id) => {
      if (!state.Design.itemsById[id]?.data) return false;

      const { back, front } = state.Design.itemsById[id]?.data;

      return (
        (back?.backgroundFillColor + front?.backgroundFillColor).match(/255/g)
          ?.length === 6 && back?.objects?.length + front?.objects?.length === 0
      );
    },
    getDesignsIdsList: (state) => state.Design.items,
  };
}

export default Design;
