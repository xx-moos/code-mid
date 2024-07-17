import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import analytics from "universal-ga";
import PropTypes from "prop-types";

import { getImageDataFromSide } from "utils/designer/canvas";
import Stage from "redux/models/Stage";
import Modal from "components/common/Modal";

export const DesignPreviewModal = () => {
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [backImagePreview, setBackImagePreview] = useState(null);
  const stage = useSelector(Stage.selectors.getStage);
  const { front, back, shadowOverlayUrl, shadowOverlayInverseUrl } = stage;
  const dispatch = useDispatch();

  useEffect(() => {
    analytics.event("Designer", "Preview");
    setFrontImagePreview(getImageDataFromSide(front, true, stage));
    setBackImagePreview(getImageDataFromSide(back, true, stage));
  }, []);

  const onClose = () => dispatch(Stage.types.togglePreview());

  return (
    <Modal isOpened={true} onClose={onClose}>
      <div className="flex flex-col divide-y divide-slate-200">
        <div className="flex justify-center	relative p-4">
          <h4 className="text-center text-lg text-gray-700">Preview</h4>
          <button
            type="button"
            className="absolute right-[1rem] top top-[0.7rem] text-xl opacity-40"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>
          <div className="flex">
            <Image
              imagePreview={frontImagePreview}
              shadowOverlayUrl={shadowOverlayUrl}
              text="Front"
            />
            <Image
              imagePreview={backImagePreview}
              shadowOverlayUrl={shadowOverlayInverseUrl}
              text="Back"
            />
          </div>
        </div>
        <div className="flex justify-center p-4">
          <button
            className="clear-button"
            onClick={() => dispatch(Stage.types.togglePreview())}
          >
            Back to Design
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Image = ({ shadowOverlayUrl, imagePreview, text }) => (
  <div className="flex-1 justify-center p-3 relative flex-col">
    <div className="flex items-center flex-col">
      <img
        src={shadowOverlayUrl}
        alt="preview-overlay"
        className="absolute z-[5] w-[300px]"
      />
      <img src={imagePreview} alt="preview-image" className="w-[300px] z-[1]" />
      <strong className="mt-2">{text}</strong>
    </div>
  </div>
);

Image.propTypes = {
  shadowOverlayUrl: PropTypes.string,
  imagePreview: PropTypes.string,
  text: PropTypes.string.isRequired,
};
