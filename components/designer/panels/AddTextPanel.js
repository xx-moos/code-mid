import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Stage from "redux/models/Stage";
import { hexToRGB } from "utils/designer/canvas";

import FontFaceObserver from "fontfaceobserver";

import { ColorPallete } from "./ColorPallete";
import { FONTS, FONT_SIZES, DEFAULT_FONT } from "constants/designer";
import { toast } from "react-toastify";

const FONT_SIZE_FACTOR = 5;

export const AddTextPanel = () => {
  const dispatch = useDispatch();
  const stage = useSelector(Stage.selectors.getStage);
  const { selectedText } = stage;
  const [text, setText] = useState("");
  const [currentFont, setCurrentFont] = useState("");
  const [currentColor, setCurrentColor] = useState("rgb(0, 0, 0)");
  const [currentSize, setCurrentSize] = useState("");
  const [hideTextSize, setHideTextSize] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(true);

  useEffect(() => {
    if (selectedText) {
      setText(selectedText.text);
      setCurrentFont(selectedText.fontFamily);
      setCurrentColor(selectedText.fill);
      setCurrentSize(selectedText.fontSize / FONT_SIZE_FACTOR);
      setHideTextSize(selectedText.scaleX === 1);
    } else {
      setText("");
    }
  }, [
    selectedText,
    selectedText?.text,
    selectedText?.fontFamily,
    selectedText?.fill,
    selectedText?.fontSize,
    selectedText?.scaleX,
  ]);

  const handleSaveChanges = () => {
    dispatch(Stage.types.handleObjectChange());
    dispatch(Stage.types.renderCanvas());
  };

  const handleColorSelected = (hexColor) => {
    const [red, green, blue] = hexToRGB(hexColor);
    const newColor = `rgb(${red}, ${green}, ${blue})`;

    const item = selectedText;
    item.set({ fill: newColor });
    handleSaveChanges();

    setCurrentColor(newColor);
  };

  const handleBold = () => {
    const item = selectedText;
    if (item.get("fontWeight") === "normal") {
      item.set("fontWeight", "bold");
    } else {
      item.set("fontWeight", "normal");
    }
    handleSaveChanges();
  };
  const handleFontSizeChange = (e) => {
    const item = selectedText;
    item.set({ fontSize: e.target.value * FONT_SIZE_FACTOR });
    setCurrentSize(e.target.value);
    handleSaveChanges();
  };

  const handleItalic = () => {
    let item = selectedText;
    if (item.get("fontStyle") === "" || item.get("fontStyle") === "normal") {
      item.set({ fontStyle: "italic" });
    } else {
      item.set({ fontStyle: "normal" });
    }
    handleSaveChanges();
  };

  const handleBulletPoint = () => {
    let item = selectedText;
    if (item.get("text").includes("• ")) {
      item.set("text", item.get("text").replace("• ", ""));
    } else {
      item.set("text", "• " + item.get("text"));
    }
    handleSaveChanges();
  };

  const handleFontChange = (e) => {
    const font = e.target.value;
    let myfont = new FontFaceObserver(font);
    myfont
      .load()
      .then(function () {
        let item = selectedText;
        item.set("fontFamily", font);
        setCurrentFont(font);
        handleSaveChanges();
      })
      .catch(() => {
        toast.error("Unable to load font");
      });
  };

  const handleAlign = (alignment) => {
    let item = selectedText;
    item.set("textAlign", alignment);
    handleSaveChanges();
  };

  const fontOptions = useMemo(
    () =>
      FONTS.map((el, i) => (
        <option value={el} key={i}>
          {el}
        </option>
      )),
    []
  );

  const sizeOptions = useMemo(
    () =>
      FONT_SIZES.map((el, i) => (
        <option value={el} key={i}>
          {el}
        </option>
      )),
    []
  );

  const handleTextAdd = async () => {
    const defaultFont = new FontFaceObserver(DEFAULT_FONT);
    defaultFont
      .load()
      .then(() => {
        dispatch(Stage.types.addTextToCanvas({ text }));
        setText("");
      })
      .catch(() => {
        toast.error("Unable to load font");
      });
  };

  return (
    <div className="py-4 px-2 w-full flex justify-center">
      {!selectedText && (
        <div>
          <input
            type="text"
            className="px-4 py-2 w-full rounded border outline-none mb-2"
            onChange={(e) => setText(e.target.value)}
            value={text}
          ></input>
          <button
            type="submit"
            disabled={text === ""}
            className="blue-button w-full"
            onClick={handleTextAdd}
          >
            Add
          </button>
        </div>
      )}

      {selectedText && (
        <div>
          <div className="font-editing-controls">
            <div>
              <select
                id="fontFamily"
                name="fontFamily"
                className="block w-full bg-white pl-1 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={handleFontChange}
                value={currentFont}
              >
                {fontOptions}
              </select>
              {hideTextSize && (
                <select
                  id="fontFamily"
                  name="fontFamily"
                  className="mt-2 block w-full bg-white pl-1 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={handleFontSizeChange}
                  value={currentSize}
                >
                  {sizeOptions}
                </select>
              )}
            </div>

            {showColorPicker && (
              <ColorPallete
                handleColorSelected={handleColorSelected}
                color={currentColor}
              />
            )}
          </div>
          <div>
            <div className="my-6 flex flex-col items-center justify-center">
              <h5 className="text-gray-800 mb-2">Text Style</h5>
              <ul className="flex items-center justify-center">
                <li>
                  <button
                    className="bold-btn tooltips h-6 w-6 mr-5"
                    onClick={handleBold}
                  >
                    <span>Bold Text</span>
                  </button>
                </li>
                <li>
                  <button
                    className="italic-btn tooltips h-6 w-6 mr-5"
                    onClick={handleItalic}
                  >
                    <span>Italic Text</span>
                  </button>
                </li>
                <li>
                  <button
                    className="bullet-point-btn tooltips h-6 w-6"
                    onClick={handleBulletPoint}
                  >
                    <span>Bullet Point Text</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="mb-6 flex flex-col items-center justify-center">
              <h5 className="text-gray-800 mb-2">Text Alignment</h5>
              <ul className="flex items-center justify-center">
                <li>
                  <button
                    className="text-align-left-btn tooltips h-6 w-6 mr-5"
                    onClick={() => {
                      handleAlign("left");
                    }}
                  >
                    <span>Align Left</span>
                  </button>
                </li>
                <li>
                  <button
                    className="text-align-right-btn tooltips h-6 w-6 mr-5"
                    onClick={() => {
                      handleAlign("right");
                    }}
                  >
                    <span>Align Right</span>
                  </button>
                </li>
                <li>
                  <button
                    className="text-align-center-btn tooltips h-6 w-6"
                    onClick={() => {
                      handleAlign("center");
                    }}
                  >
                    <span>Align Center</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h5 className="text-gray-800 mb-2">Alignment</h5>
              <ul className="flex items-center justify-center">
                <li>
                  <button
                    className="align-center-btn tooltips h-6 w-6 mr-5"
                    onClick={() =>
                      dispatch(Stage.types.alignCenterHorizontal())
                    }
                  >
                    <span>Align Center</span>
                  </button>
                </li>
                <li>
                  <button
                    className="align-middle-btn tooltips h-6 w-6"
                    onClick={() => dispatch(Stage.types.alignCenterVertical())}
                  >
                    <span>Align Middle</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
