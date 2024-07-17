import { CheckIcon } from "@heroicons/react/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Stage from "redux/models/Stage";
import PropTypes from "prop-types";
import useClickOutside from "hooks/useClickOutside";

const DesignNameForm = ({
  defaultName,
  designId,
  formClass,
  inputClass,
  showLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(defaultName);
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();
  useClickOutside(wrapperRef, () => setIsEditing(false));

  const handleSaveTitle = useCallback(
    (e) => {
      e.preventDefault();
      setIsEditing(false);
      dispatch(Stage.types.saveDesignName({ name: title, designId }));
    },
    [title, designId]
  );

  useEffect(() => {
    setTitle(defaultName);
  }, [defaultName]);

  return (
    <form
      ref={wrapperRef}
      className={formClass}
      onSubmit={(e) => {
        e.preventDefault();
        setIsEditing(false);
      }}
    >
      <div className="flex gap-3 items-center">
        {showLabel && (
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Freshener Name
          </label>
        )}
        <input
          type="title"
          name="title"
          id="title"
          value={title}
          className={inputClass}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => !isEditing && setIsEditing(true)}
        />
      </div>
      {isEditing && (
        <button
          type="submit"
          className="w-[50px] blue-button"
          onClick={handleSaveTitle}
        >
          <CheckIcon className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

DesignNameForm.propTypes = {
  defaultName: PropTypes.string,
  showLabel: PropTypes.bool,
  formClass: PropTypes.string,
  inputClass: PropTypes.string,
  designId: PropTypes.string,
};

DesignNameForm.defaultProps = {
  defaultName: "",
  formClass: "flex items-center w-full md:w-[215px]",
  inputClass:
    "py-1.5 px-2 md:w-[150px] w-full placeholder:text-gray-500 text-sm rounded-md outline-none mr-[5px] border",
};

export default DesignNameForm;
