import { Model, attr } from "redux-orm";

import { SIDES } from "constants/designer";

class Stage extends Model {
  static modelName = "Stage";

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      imageUrl: attr(),
      currentSide: attr({ getDefault: () => SIDES.FRONT }),
      front: attr(),
      back: attr(),
      frontRedoHistory: attr({ getDefault: () => [] }),
      backRedoHistory: attr({ getDefault: () => [] }),
      frontUndoHistory: attr({ getDefault: () => [] }),
      backUndoHistory: attr({ getDefault: () => [] }),
      frontBackgroundShape: attr(),
      backBackgroundShape: attr(),
      frontOverlayShapes: attr({ getDefault: () => [] }),
      backOverlayShapes: attr({ getDefault: () => [] }),
      showPreviewModal: attr({ getDefault: () => false }),
      showRemoveWarningModal: attr({ getDefault: () => false }),
      showConfirmDuplicateOtherSideWarningModal: attr({
        getDefault: () => false,
      }),
      width: attr(),
      height: attr(),
      shapeWidth: attr(),
      shapeHeight: attr(),
      shadowOverlayUrl: attr(),
      shadowOverlayInverseUrl: attr(),
      activeTab: attr(),
      backBackgroundColor: attr({ getDefault: () => "#fff" }),
      frontBackgroundColor: attr({ getDefault: () => "#fff" }),
      withWarningText: attr({ getDefault: () => true }),
      selectedText: attr({ getDefault: () => false }),
      multipleItemsSelected: attr({ getDefault: () => false }),
      hasUndo: attr({ getDefault: () => ({}) }),
      hasRedo: attr({ getDefault: () => ({}) }),
    };
  }

  static types = {
    uploadImage: (payload) => ({ type: "STAGE/UPLOAD_IMAGE", payload }),
    displayProcessedImage: (payload) => ({
      type: "STAGE/DISPLAY_PROCESSED_IMAGE",
      payload,
    }),
    saveDesign: (payload) => ({ type: "STAGE/SAVE_DESIGN", payload }),
    update: (payload) => ({ type: "STAGE/UPDATE", payload }),
    toggleSide: (payload) => ({ type: "STAGE/TOGGLE_SIDE", payload }),
    togglePreview: (payload) => ({ type: "STAGE/TOGGLE_PREVIEW", payload }),
    toggleConfirmRemoveWarning: (payload) => ({
      type: "STAGE/TOGGLE_CONFIRM_REMOVE_WARNING",
      payload,
    }),
    toggleConfirmDuplicateOtherSideWarning: (payload) => ({
      type: "STAGE/TOGGLE_CONFIRM_DUPLICATE_OTHER_SIDE_WARNING",
      payload,
    }),
    deleteItem: (payload) => ({ type: "STAGE/DELETE_IMAGE", payload }),
    setBackgroundColor: (payload) => ({
      type: "STAGE/SET_BACKGROUND_COLOR",
      payload,
    }),
    setWithWarningText: (payload) => ({
      type: "STAGE/SET_WITH_WARNING_TEXT",
      payload,
    }),
    duplicate: (payload) => ({ type: "STAGE/DUPLICATE", payload }),
    duplicateToOtherSide: (payload) => ({
      type: "STAGE/DUPLICATE_TO_OTHER_SIDE",
      payload,
    }),
    alignCenterHorizontal: (payload) => ({
      type: "STAGE/ALIGN_CENTER_HORIZONTAL",
      payload,
    }),
    alignCenterVertical: (payload) => ({
      type: "STAGE/ALIGN_CENTER_VERTICAL",
      payload,
    }),
    moveLayerUp: (payload) => ({ type: "STAGE/MOVE_LAYER_UP", payload }),
    moveLayerDown: (payload) => ({ type: "STAGE/MOVE_LAYER_DOWN", payload }),
    scaleUp: (payload) => ({ type: "STAGE/SCALE_UP", payload }),
    scaleDown: (payload) => ({ type: "STAGE/SCALE_DOWN", payload }),
    addTextToCanvas: (payload) => ({
      type: "STAGE/ADD_TEXT_TO_CANVAS",
      payload,
    }),
    handleObjectChange: (payload) => ({ type: "STAGE/OBJECT_CHANGE", payload }),
    undo: (payload) => ({ type: "STAGE/UNDO", payload }),
    redo: (payload) => ({ type: "STAGE/REDO", payload }),
    renderCanvas: (payload) => ({ type: "STAGE/RENDER_CANVAS", payload }),
    saveDesignName: (payload) => ({
      type: "STAGE/UPDATE_DESIGN_NAME",
      payload,
    }),
  };

  static reducer(action, Stage, session) {
    const stage = Stage.all().first() || Stage.create({});

    switch (action.type) {
      case this.types.update().type:
        stage.update({ ...action.payload });
        break;
      case this.types.togglePreview().type:
        stage.update({ showPreviewModal: !stage.showPreviewModal });
        break;
      case this.types.toggleConfirmRemoveWarning().type:
        stage.update({ showRemoveWarningModal: !stage.showRemoveWarningModal });
        break;
      case this.types.toggleConfirmDuplicateOtherSideWarning().type:
        stage.update({
          showConfirmDuplicateOtherSideWarningModal:
            !stage.showConfirmDuplicateOtherSideWarningModal,
        });
        break;
      case this.types.setBackgroundColor().type:
        stage.update({
          [`${stage.currentSide}BackgroundColor`]: action.payload.color,
        });
        break;
      case this.types.setWithWarningText().type:
        stage.update({
          withWarningText: action.payload.withWarningText,
        });
        break;
    }
  }

  static selectors = {
    getStage: (state) => Object.values(state.Stage.itemsById)[0],
  };
}

export default Stage;
