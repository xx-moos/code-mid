import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Stage from "redux/models/Stage";
import { otherSideHasObjects } from "utils/designer/canvas";

export const CopyPanel = () => {
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);

  const handleCopyToOtherSide = () => {
    if (otherSideHasObjects(stage)) {
      dispatch(Stage.types.toggleConfirmDuplicateOtherSideWarning());
    } else {
      dispatch(Stage.types.duplicateToOtherSide());
    }
  };

  const buttonClass = useMemo(
    () => "w-[30px] h-[30px] bg-slate-200 rounded",
    []
  );
  const mainClass = useMemo(() => "flex flex-col items-center w-full py-4", []);

  return (
    <>
      <div className={mainClass}>
        <div className="mb-3 text-gray-800">Duplicate</div>
        <button
          className="copy-paste-btn h-7 w-7"
          onClick={() => dispatch(Stage.types.duplicate())}
        />
      </div>
      <div className={mainClass}>
        <div className="mb-3 text-gray-800">Duplicate Design to Other Side</div>
        <button
          className="copy-other-side-btn h-7 w-7"
          onClick={handleCopyToOtherSide}
        />
      </div>
    </>
  );
};
