import PropTypes from "prop-types";
import classNames from "classnames";

import { SIDES } from "constants/designer";

export const Canvas = ({ side, currentSide }) => {
  const value = SIDES[side];
  const isVisible = currentSide === value;

  return (
    <div
      id={`${value}-container`}
      className={classNames(!isVisible && "hidden")}
    >
      <canvas id={value}></canvas>
    </div>
  );
};

Canvas.propTypes = {
  side: PropTypes.string.isRequired,
  currentSide: PropTypes.string.isRequired,
};
