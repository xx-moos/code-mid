import {
  STATUS_COMPLETED,
  STATUS_FAILED,
  STATUS_IN_PROGRESS,
} from "constants/custom_shape";
import { Model, attr } from "redux-orm";

class CustomShape extends Model {
  static modelName = "CustomShape";

  static get fields() {
    return {
      id: attr(),
      order_id: attr(),
      design_id: attr(),
      type: attr(),
      task: attr(),
      original_image: attr(),
      image_with_hole: attr(),
      stringHolePosition: attr(),
      design_attributes: attr(),
    };
  }

  static types = {
    create: (payload) => ({
      type: "CUSTOM_SHAPE/CREATE",
      payload,
    }),
    update: (payload) => ({
      type: "CUSTOM_SHAPE/UPDATE",
      payload,
    }),
    delete: (payload) => ({
      type: "CUSTOM_SHAPE/DELETE",
      payload,
    }),
    processImage: (payload) => ({
      type: "CUSTOM_SHAPE/POST",
      payload,
    }),
    getProcessedImage: (payload) => ({
      type: "CUSTOM_SHAPE/GET",
      payload,
    }),
    drawStringHole: (payload) => ({
      type: "CUSTOM_SHAPE/DRAW",
      payload,
    }),
    saveCustomDesign: (payload) => ({
      type: "CUSTOM_SHAPE/SAVE_DESIGN",
      payload,
    }),
    setStringHolePosition: (payload) => ({
      type: "CUSTOM_SHAPE/SET_POSITION",
      payload,
    }),
  };

  static reducer(action, CustomShape, session) {
    const customShape = CustomShape.all().first();

    switch (action.type) {
      case this.types.create().type:
        CustomShape.delete();
        CustomShape.create({ ...action.payload });
        break;

      case this.types.delete().type:
        CustomShape.delete();
        break;

      case this.types.update().type:
        customShape.update({ ...action.payload });
        break;
      case this.types.setStringHolePosition().type:
        customShape.update({ stringHolePosition: action.payload });
        break;
    }
  }

  static selectors = {
    getCustomShape: (state) =>
      state.CustomShape.itemsById[state.CustomShape.items[0]] || {},
    getCustomShapeId: (state) => state.CustomShape.items[0],
    isProcessing: (state) =>
      state.CustomShape.itemsById[state.CustomShape.items[0]]?.task?.status ===
      STATUS_IN_PROGRESS,
    hasFailed: (state) =>
      state.CustomShape.itemsById[state.CustomShape.items[0]]?.task?.status ===
      STATUS_FAILED,
    isCompleted: (state) =>
      state.CustomShape.itemsById[state.CustomShape.items[0]]?.task?.status ===
      STATUS_COMPLETED,
    getOriginalImage: (state) =>
      state.CustomShape.itemsById[state.CustomShape.items[0]]?.original_image,
  };
}

export default CustomShape;
