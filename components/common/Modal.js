import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Modal = ({ isOpened, onClose, children, size = "lg" }) => {
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classNames(
                "relative inline-block bg-white rounded-lg text-left shadow-xl transform transition-all my-8 align-middle w-full",
                size === "lg" && "max-w-4xl",
                size === "md" && "max-w-2xl",
                size === "sm" && "max-w-xs"
              )}
            >
              <button
                className="absolute -right-1 -top-2 text-2xl text-gray-500 hover:text-gray-700 px-3 py-2 z-10 focus:outline-none"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Modal.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(["lg", "md", "sm"]),
};

export default Modal;
