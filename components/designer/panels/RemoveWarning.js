import { useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "redux/models/Checkout";

import Stage from "redux/models/Stage";

export const RemoveWarning = ({}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);
  const { withWarningText } = stage;
  const selectedDesign = useSelector(Checkout.selectors.getSelectedDesign);

  const handleChange = useCallback(
    (event) => {
      if (withWarningText) {
        event.preventDefault();
        dispatch(Stage.types.toggleConfirmRemoveWarning());
      } else {
        dispatch(
          Stage.types.setWithWarningText({
            withWarningText: true,
            design_id: selectedDesign,
          })
        );
      }
    },
    [withWarningText]
  );

  return (
    <div className="w-full flex justify-center items-center py-4">
      <input
        type="checkbox"
        ref={ref}
        checked={!withWarningText}
        id="removeWarning"
        className="mr-2"
        onChange={handleChange}
      />
      <label htmlFor="removeWarning">Remove Warning</label>
    </div>
  );
};
