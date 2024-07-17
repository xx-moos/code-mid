export const DEFAULT_ZOOM_FACTOR = 0.5;
export const SHAPE_LINES = [
  "bleed_dash",
  "base_dash",
  "safe_dash",
  "warning",
  "warning_inverse",
  "hole_dash",
];
export const SIDES = { FRONT: "front", BACK: "back" };
export const TABS = {
  TEXT: "text",
  IMAGE: "image",
  BG_COLOR: "bgColor",
  FORMAT: "format",
  COPY: "copy",
};

export const LIGHT_COLORS = [
  "#FFFFFF",
  "#c1d3ec",
  "#b3e5f9",
  "#b8dfc7",
  "#f4f5b7",
  "#f8bec8",
  "#f9cee2",
  "#c5c0df",
];

export const MEDIUM_COLORS = [
  "#1f4a9f",
  "#01bbf2",
  "#35b877",
  "#fef559",
  "#f05f57",
  "#ef509b",
  "#635ca7",
];

export const MEDIUM_DARK_COLORS = [
  "#223989",
  "#0093d8",
  "#009149",
  "#eeb61b",
  "#cf1f25",
  "#bf1978",
  "#413989",
];

export const DARK_COLORS = [
  "#19245a",
  "#143872",
  "#094021",
  "#4f2a1a",
  "#62251e",
  "#591f3e",
  "#242358",
  "#000000",
];

export const COLORS = LIGHT_COLORS.concat(MEDIUM_COLORS)
  .concat(MEDIUM_DARK_COLORS)
  .concat(DARK_COLORS);

export const FONTS = [
  "Damion",
  "Droid Serif",
  "Lobster",
  "Lobster Two",
  "Monoton",
  "OpenSans",
  "OpenSans SemiBold",
  "OpenSans ExtraBold",
  "OpenSans Light",
  "Oswald",
  "Oswald Light",
  "Pacifico",
  "Pinyon Script",
  "Roboto",
  "Roboto Black",
  "Roboto Light",
  "Roboto Medium",
  "Roboto Thin",
  "Rokkitt",
  "Share Tech Mono",
  "Unkempt",
];

export const FONT_SIZES = [
  10, 12, 14, 18, 20, 24, 26, 28, 32, 36, 42, 48, 52, 64, 72, 88, 96,
];

export const DEFAULT_FONT = "OpenSans";
