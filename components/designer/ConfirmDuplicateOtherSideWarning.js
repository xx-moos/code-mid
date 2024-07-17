import { useCallback } from "react";
import { useDispatch } from "react-redux";

import Modal from "components/common/Modal";
import Stage from "redux/models/Stage";

export const ConfirmDuplicateOtherSideWarning = () => {
  const dispatch = useDispatch();

  const onClose = useCallback(
    () => dispatch(Stage.types.toggleConfirmDuplicateOtherSideWarning()),
    []
  );

  const onConfirm = useCallback(() => {
    dispatch(Stage.types.duplicateToOtherSide());
    onClose();
  }, []);

  return (
    <Modal isOpened={true} onClose={onClose} size="md">
      <div className="flex flex-col divide-y divide-slate-200">
        <div className="flex justify-center	relative p-4">
          <h4 className="text-lg text-gray-800 text-center">Are You Sure?</h4>
          <button
            type="button"
            className="absolute right-[1rem] top top-[0.7rem] text-xl opacity-40"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col items-center py-4 px-5 text-sm">
          <div className="text-gray-500 mb-6 mt-4">
            Any artwork on the other side of this design will be lost. This
            action can not be undone.
          </div>

          <div className="flex justify-evenly w-full">
            <button className="blue-button capitalize" onClick={onConfirm}>
              duplicate
            </button>
            <button className="clear-button capitalize" onClick={onClose}>
              cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
