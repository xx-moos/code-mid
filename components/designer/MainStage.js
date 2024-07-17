import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Stage from "redux/models/Stage";
import { SIDES } from "constants/designer";
import { ConfirmRemoveWarning } from "./ConfirmRemoveWarning";
import { ConfirmDuplicateOtherSideWarning } from "./ConfirmDuplicateOtherSideWarning";
import { DesignPreviewModal } from "./DesignPreviewModal";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { InitialWarning } from "./InitialWarning";
import { useRouter } from "next/router";
import Design from "redux/models/Design";
import { initCanvasWithDesign } from "utils/designer";
import App from "redux/models/App";

export const MainStage = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);
  const {
    query: { designId },
  } = useRouter();
  const design = useSelector((state) =>
    Design.selectors.getDesign(state, designId)
  );
  const [openInitialModal, setOpenInitialModal] = useState(true);
  const {
    currentSide,
    showPreviewModal,
    showRemoveWarningModal,
    showConfirmDuplicateOtherSideWarningModal,
  } = stage;

  useEffect(() => {
    if (design?.shape?.id) {
      dispatch(App.types.showLoader());
      initCanvasWithDesign(
        design,
        stage,
        containerRef.current,
        dispatch
      ).finally(() => {
        dispatch(App.types.hideLoader());
      });
    }
  }, [design?.shape?.id]);

  return (
    <div className="flex-col w-full card p-0">
      {showPreviewModal && <DesignPreviewModal />}
      {showRemoveWarningModal && <ConfirmRemoveWarning />}
      {showConfirmDuplicateOtherSideWarningModal && (
        <ConfirmDuplicateOtherSideWarning />
      )}
      <InitialWarning
        onClose={() => setOpenInitialModal(false)}
        open={openInitialModal}
      />
      <TopBar />
      <div
        ref={containerRef}
        id="stage-container"
        className="mt-4 lg:mt-0 w-full z-[1] min-h-[600px] flex items-center justify-center"
      >
        {Object.keys(SIDES).map((side) => (
          <Canvas key={side} side={side} currentSide={currentSide} />
        ))}
      </div>
    </div>
  );
};
