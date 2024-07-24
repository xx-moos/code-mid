import Modal from "components/common/Modal";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Stage from "redux/models/Stage";
import { resolveServerImages } from "utils/resolveServerImages";

const WarningDisabledConfimationModal = ({ open, onClose, design }) => {
  const dispatch = useDispatch();

  const designList = useMemo(
    () => (Array.isArray(design) ? design : [design]).filter(Boolean),
    [design]
  );

  const handleConfirm = useCallback(() => {
    designList.map((selectedDesign) => {
      if (selectedDesign?.warning_enabled) return;

      dispatch(
        Stage.types.setWithWarningText({
          withWarningText: true,
          design_id: selectedDesign?.id,
          cb: () => onClose("confirm"),
        })
      );
    });
  }, [onClose, designList]);

  return (
    <Modal isOpened={open} onClose={() => onClose()} size="lg">
      <div className="lg:px-10 px-5 lg:pt-10 pt-5 lg:pb-16 pb-8">
        <h3 className="text-center text-3xl mb-8">Please Note</h3>

        {designList?.map((selectedDesign, index) => (
          <div className="flex space-x-5 mb-8" key={`design-${index}`}>
            <div className="flex-shrink-0 flex flex-row items-left space-x-2 mr-2">
              <img
                src={resolveServerImages(selectedDesign.front_proof)}
                className="w-10 h-10 rounded-md object-contain"
              />

              <img
                src={resolveServerImages(selectedDesign.back_proof)}
                className="w-10 h-10 rounded-md object-contain"
              />
            </div>

            <h4 className="text-md lg:text-lg">
              You have elected to remove the warning text on the{" "}
              <span className="text-blue-600 font-bold">
                #{selectedDesign.id}
              </span>{" "}
              design from IP{" "}
              <span className="text-blue-600 font-bold">
                {selectedDesign?.warning_disabled_ip}
              </span>{" "}
              at{" "}
              {selectedDesign?.warning_disabled_at && (
                <span className="text-blue-600 font-bold">
                  {dayjs(selectedDesign?.warning_disabled_at).format(
                    "MM/DD/YYYY HH:mm A"
                  )}
                </span>
              )}
            </h4>
          </div>
        ))}
        <p className="text-md lg:text-lg mb-5 text-center">
          Would you like to reinstate the warning text?
        </p>

        <div className="flex items-center justify-center space-x-5">
          <button
            className="blue-button"
            onClick={() => handleConfirm(design)}
          >
            Yes, reinstate the warning text
          </button>
          <button className="red-button" onClick={() => onClose("cancel")}>
            No, continue without warning
          </button>
        </div>
        <div />
      </div>
    </Modal>
  );
};

export default WarningDisabledConfimationModal;
