import { useMemo } from "react";
import { useDispatch } from "react-redux";

import Stage from "redux/models/Stage";

export const FormatPanel = () => {
  const dispatch = useDispatch();
  const mainClass = useMemo(() => "flex justify-center items-center w-full py-4", []);

  return (
    <>
      <div className={mainClass}>
        <div className="mr-5 text-gray-800">Alignment:</div>
        <button
          className="align-center-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.alignCenterHorizontal())}
        >
          <span>Align Center</span>
        </button>
        <button
          className="align-middle-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.alignCenterVertical())}
        >
          <span>Align Middle</span>
        </button>
      </div>

      <div className={mainClass}>
        <div className="mr-5 text-gray-800">Layers:</div>
        <button
          className="layer-up-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.moveLayerUp())}
        >
          <span>Move Layer Up</span>
        </button>
        <button
          className="layer-down-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.moveLayerDown())}
        >
          <span>Move Layer Down</span>
        </button>
      </div>

      <div className={mainClass}>
        <div className="mr-5 text-gray-800">Scale:</div>
        <button
          className="scale-plus-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.scaleUp())}
        >
          <span>Scale Up</span>
        </button>
        <button
          className="scale-minus-btn tooltips h-6 w-6 mr-5"
          onClick={() => dispatch(Stage.types.scaleDown())}
        >
          <span>Scale Down</span>
        </button>
      </div>
    </>
  );
};
