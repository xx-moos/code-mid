import { Model, attr, fk } from "redux-orm";

class LassoShape extends Model {
  static modelName = "LassoShape";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      imageWithPadding: attr(),
      imageWithPaddingRaster: attr(),
      cutFilePath: attr(),
      originalImage: attr(),
      designAttributes: attr({ getDefault: () => ({}) }),
      position: attr({ getDefault: () => [] }),
    };
  }

  static types = {
    setOriginalImage: (payload) => ({
      type: "LASSO/SET_ORIGINAL_IMAGE",
      payload,
    }),
    update: (payload) => ({
      type: "LASSO/UPDATE",
      payload,
    }),
    saveLassoDesign: (payload) => ({
      type: "LASSO/SAVE",
      payload,
    }),
  };

  static reducer(action, LassoShape, session) {
    const lassoShape = LassoShape.all().first() || LassoShape.create({});

    switch (action.type) {
      case this.types.setOriginalImage().type:
        lassoShape.update({ originalImage: action.payload });
        break;
      case this.types.update().type:
        lassoShape.update(action.payload);
        break;

      case this.types.saveLassoDesign().type:
        break;
    }
  }

  static selectors = {
    getOriginalImage: (state) => state.LassoShape.itemsById[0]?.originalImage,
    getCutFilePath: (state) => state.LassoShape.itemsById[0]?.cutFilePath,
    getImageWithPaddingRaster: (state) =>
      state.LassoShape.itemsById[0]?.imageWithPaddingRaster,
    getImageWithPadding: (state) =>
      state.LassoShape.itemsById[0]?.imageWithPadding,
    getDesignAttributes: (state) =>
      state.LassoShape.itemsById[0]?.designAttributes,
  };
}

export default LassoShape;
