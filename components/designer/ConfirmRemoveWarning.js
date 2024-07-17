import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import getConfig from "next/config";

import Stage from "redux/models/Stage";
import Modal from "components/common/Modal";
import Checkout from "redux/models/Checkout";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const ConfirmRemoveWarning = () => {
  const dispatch = useDispatch();

  const selectedDesign = useSelector(Checkout.selectors.getSelectedDesign);

  const handleConfirm = useCallback((_event) => {
    dispatch(
      Stage.types.setWithWarningText({
        withWarningText: false,
        design_id: selectedDesign,
      })
    );
    dispatch(Stage.types.toggleConfirmRemoveWarning());
  }, []);

  const handleClose = () => dispatch(Stage.types.toggleConfirmRemoveWarning());
  const publicS3Url =
    serverRuntimeConfig.publicS3Url || publicRuntimeConfig.publicS3Url;

  return (
    <Modal isOpened={true} onClose={handleClose} size="md">
      <div className="relative px-8 py-4 flex flex-col justify-center items-center">
        <h2 className="relative w-full text-center text-4xl uppercase py-6 text-gray-500 opacity-80 before:border-t-2 before:border-slate-300 before:border-dashed before:content-[''] before:my-0 before:mx-auto before:absolute before:top-[50%] before:left-0 before:right-0 before:bottom-0 before:width-[95%] before:-z-[1]">
          <span className="bg-white px-6">warning</span>
        </h2>
        <div className="flex items-center sm:flex-row flex-col-reverse">
          <img
            src={`${publicS3Url}/designer/img/plastic-damage.jpg`}
            className="sm:w-[33.33333%] mt-5 sm:mt-0"
            alt="plastic-damage"
          />
          <div className="text-sm ml-5 text-gray-700 opacity-80 md:text-justify space-y-2">
            <p>
              All fresheners ordered from this site are designed to hang freely,
              and are not to come in contact with any plastic, painted, or
              varnished surface.
            </p>
            <p>
              Make My Freshener advises that the disclaimer, "Avoid contact with
              painted, plastic, or varnished surfaces" be printed on all
              fresheners.
            </p>
            <p>
              If requested that the disclaimer be removed, the person accepting
              below assumes all responsibility and liability for damage that may
              be caused by the fresheners.
            </p>
            <p>
              The person accepting below also releases Make My Freshener from
              any and all liability due to damage caused by the fresheners.
            </p>
          </div>
        </div>
        <h5 className="mt-10 text-sm">
          Are you sure you want to remove the warning text?
        </h5>
        <div className="flex my-6 w-full justify-around">
          <button className="red-button items-center" onClick={handleClose}>
            No, Do Not Remove Text
          </button>
          <button className="blue-button items-center" onClick={handleConfirm}>
            Yes, Remove Text
          </button>
        </div>
      </div>
    </Modal>
  );
};
