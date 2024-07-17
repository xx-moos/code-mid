import Modal from "components/common/Modal";

export const ConfirmationModal = ({
  isOpened,
  onCancel,
  onConfirm,
  text = "Are you sure?",
  title,
  variant,
  size = "sm",
  cancelLabel = "No",
  confirmLabel = "Yes",
}) => {
  const variantButtons = {
    danger: {
      confirm: "px-5 red-button",
      cancel: "px-5 clear-button",
    },
    default: {
      confirm: "px-5 blue-button",
      cancel: "px-5 clear-button",
    },
  };

  const buttonClasses = variantButtons[variant] || variantButtons.default;

  return (
    <Modal isOpened={isOpened} onClose={onCancel} size={size}>
      <div className="relative px-8 py-4 flex flex-col justify-center items-center">
        <div className="text-gray-700 opacity-80 md:text-center space-y-4 text center">
          {title && <h3 className="text-xl mt-5 font-bold ">{title}</h3>}
          <p>{text}</p>
          <div className="flex my-6 w-full justify-around space-x-4">
            <button
              className={buttonClasses.cancel}
              type="button"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              className={buttonClasses.confirm}
              type="button"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
