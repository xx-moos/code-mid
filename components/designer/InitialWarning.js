import Modal from "components/common/Modal";
import { resetZoom } from "utils";

export const InitialWarning = ({ open, onClose }) => {
  return (
    <Modal
      isOpened={open}
      onClose={() => {
        resetZoom();
        onClose();
      }}
      size="md"
    >
      <div className="relative p-4 flex flex-col justify-center items-center">
        <h2 className="relative w-full text-center text-4xl uppercase py-6 text-gray-500 opacity-80 before:border-t-2 before:border-slate-300 before:border-dashed before:content-[''] before:my-0 before:mx-auto before:absolute before:top-[50%] before:left-0 before:right-0 before:bottom-0 before:width-[95%] before:-z-[1]">
          <span className="bg-white px-6">PLEASE NOTE</span>
        </h2>
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 opacity-80 text-center">
            <p className="font-semibold">
              FRESHENER MATERIAL IS ABSORBENT AND TEXTURED
            </p>
            <p>
              Your original artwork will experience some loss of resolution and
              color intensity
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-6 mt-4">
            <div className="flex w-fit flex-col items-center">
              <img
                alt="ORIGINAL ARTWORK"
                src="https://flower-manufacturing.s3.amazonaws.com/frontend/makemyfresheners/img/guidelines-1-src.jpg"
              />
              <label className="text-xs text-gray-500">ORIGINAL ARTWORK</label>
            </div>
            <div className="flex w-fit flex-col items-center">
              <img
                alt="ORIGINAL ARTWORK"
                src="https://flower-manufacturing.s3.amazonaws.com/frontend/makemyfresheners/img/guidelines-1-print.jpg"
              />
              <label className="text-xs text-gray-500">ACTUAL FRESHENER</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row my-6 w-full justify-center gap-3 sm:gap-5">
          <a href="/guidelines" target="_blank" className="truncate">
            <div className="clear-button w-full sm:w-56 cursor-pointer">
              See our printing guide
            </div>
          </a>
          <button
            className="blue-button w-full sm:w-56"
            onClick={() => {
              resetZoom();
              onClose();
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};
