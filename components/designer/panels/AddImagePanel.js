import { useDispatch, useSelector } from "react-redux";

import { UploadIcon } from "@heroicons/react/outline";
import { useEffect, useRef } from "react";

import Stage from "redux/models/Stage";
import { convertHeicToPng } from "utils/file";

export const AddImagePanel = () => {
  const dispatch = useDispatch();

  const handleUpload = (fileRef) => dispatch(Stage.types.uploadImage(fileRef));

  const ref = useRef(null);
  const stage = useSelector(Stage.selectors.getStage);
  const { back, front, currentSide } = stage;
  const cleanInput = () => (ref.current.value = "");

  useEffect(() => {
    if (
      (currentSide === "back" && back?._objects?.length === 0) ||
      (currentSide === "front" && front?._objects?.length === 0)
    ) {
      cleanInput();
    }
  }, [back?._objects?.length, front?._objects?.length]);

  const handleImageChange = async () => {
    let file = ref.current.files[0];

    if (file.type.includes("heic")) {
      file = await convertHeicToPng(file);
    }

    if (!file) return;
    if (file.size > 15000000) {
      alert("Sorry - that file is larger than the 15MB maximum file size");
      return;
    }
    handleUpload(file);
  };

  return (
    <div>
      <div className="py-4 flex items-center">
        <label htmlFor="fileInput" className="blue-button cursor-pointer">
          <UploadIcon className="h-5 w-5 mr-2" />
          <span className="uppercase hidden lg:block">
            Upload From Computer
          </span>
          <span className="uppercase block lg:hidden">Upload From Phone</span>
          <input
            type="file"
            className="opacity-0 hidden"
            ref={ref}
            id="fileInput"
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png,.gif,.bmp,.eps,.pdf,.ai,.tif,.tiff,.heic"
          />
        </label>
      </div>
    </div>
  );
};
