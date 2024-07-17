import { useDispatch, useSelector } from "react-redux";

import Stage from "redux/models/Stage";
import { hexToRGB } from "utils/designer/canvas";
import { ColorPallete } from "./ColorPallete";

export const BackgroundPanel = () => {
  const dispatch = useDispatch();

  const handleColorSelected = (colour) => {
    const pixel = hexToRGB(colour);
    const red = pixel[0];
    const green = pixel[1];
    const blue = pixel[2];
    const color = `rgb(${red}, ${green}, ${blue})`;

    dispatch(Stage.types.setBackgroundColor({ color }));
  };

  const stage = useSelector(Stage.selectors.getStage);
  const color = stage[`${stage.currentSide}BackgroundColor`];

  return (
    <ColorPallete handleColorSelected={handleColorSelected} color={color} />
  );
};
