import { getShape } from "services/DesignerService";
import {
  getBackBackgroundShape,
  getFrontBackgroundShape,
  recoverDesign,
  resize,
  setOverlay,
} from "./canvas";
import Stage from "redux/models/Stage";
import { getFabric } from "utils/fabric";
import getConfig from "next/config";
import { SIDES } from "constants/designer";

const {
  publicRuntimeConfig: { publicS3Url },
} = getConfig();

export async function initCanvasWithDesign(design, stage, container, dispatch) {
  getFabric().then(async (fabric) => {
    fabric.Object.prototype.objectCaching = false;
    const initialOptions = {
      preserveObjectStacking: true,
      backgroundColor: "#fff",
      originX: "center",
      originY: "center",
    };
    const shape = await getShape(design.shape.id);
    const front = new fabric.Canvas("front", initialOptions);
    const back = new fabric.Canvas("back", initialOptions);
    const frontBackgroundShape = await getFrontBackgroundShape(shape);
    const backBackgroundShape = await getBackBackgroundShape(
      frontBackgroundShape
    );
    const isMobile = window.innerWidth < 1024;
    front.setBackgroundImage(frontBackgroundShape);
    back.setBackgroundImage(backBackgroundShape);
    await setOverlay({
      shape,
      fabric,
      front,
      back,
      withWarningText: design?.warning_enabled,
    });

    resize({
      containerRef: container,
      isMobile,
      front,
      back,
      frontBackgroundShape,
      backBackgroundShape,
    });
    const width = Math.round((shape.width / 300 - 0.16) * 100) / 100;
    const height = Math.round((shape.height / 300 - 0.16) * 100) / 100;
    const {
      width: shapeWidth,
      height: shapeHeight,
      shadow_overlay,
      shadow_overlay_inverse,
    } = shape;

    const overlayIndex = shadow_overlay.indexOf("shapes");
    const overlayKey = shadow_overlay.substring(overlayIndex);
    const inverseIndex = shadow_overlay_inverse.indexOf("shapes");
    const inverseKey = shadow_overlay_inverse.substring(inverseIndex);

    const newStage = {
      imageUrl: undefined,
      currentSide: SIDES.FRONT,
      frontRedoHistory: [],
      backRedoHistory: [],
      frontUndoHistory: [],
      backUndoHistory: [],
      frontOverlayShapes: [],
      backOverlayShapes: [],
      showPreviewModal: false,
      showRemoveWarningModal: false,
      showConfirmDuplicateOtherSideWarningModal: false,
      activeTab: undefined,
      backBackgroundColor: "#fff",
      frontBackgroundColor: "#fff",
      withWarningText: design?.warning_enabled,
      selectedText: false,
      multipleItemsSelected: false,
      hasUndo: {},
      hasRedo: {},
      front,
      back,
      frontBackgroundShape,
      backBackgroundShape,
      width,
      height,
      shapeName: shape.name,
      shapeWidth,
      shapeHeight,
      shadowOverlayUrl: publicS3Url + "/" + overlayKey,
      shadowOverlayInverseUrl: publicS3Url + "/" + inverseKey,
      initCheckout: !design?.warning_enabled,
    };

    dispatch(Stage.types.update(newStage));
    if (design?.data?.front && design?.data?.back) {
      recoverDesign({
        stage: { ...stage, ...newStage },
        backData: design?.data?.back,
        frontData: design?.data?.front,
      });
    }
  });
}
