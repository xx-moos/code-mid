import { useCallback } from "react";
import PropTypes from "prop-types";

import { RGBtoCMYK } from "utils/designer/canvas";
import { COLORS } from "constants/designer";

export const ColorPallete = ({ handleColorSelected, color }) => {
  const getCmyk = useCallback(
    (color) => {
      if (["white", "#fff"].includes(color)) {
        return { c: 0, m: 0, y: 0, k: 0 };
      }
      const rgb = color.split("(")[1].split(")")[0].split(",");

      return RGBtoCMYK(rgb[0], rgb[1], rgb[2]);
    },
    [color]
  );

  const cmyk = getCmyk(color);

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex flex-wrap p-2.5 justify-center">
        {COLORS.map((backgroundColor) => (
          <div
            className="w-[30px] h-[30px] rounded cursor-pointer m-[5px] border border-gray-300"
            key={backgroundColor}
            onClick={() => handleColorSelected(backgroundColor)}
            style={{ backgroundColor: backgroundColor }}
          ></div>
        ))}
      </div>
      <div className="flex items-center justify-center ">
        <div
          className="w-[30px] h-[30px] border border-gray-300 rounded mr-4"
          style={{ backgroundColor: color }}
        ></div>
        <span className="pt-1.5 text-slate-500 mb-2">
          C:{cmyk.c} M:{cmyk.m} Y:{cmyk.y} K:{cmyk.k}
        </span>
      </div>
    </div>
  );
};

ColorPallete.propTypes = {
  handleColorSelected: PropTypes.func.isRequired,
};
