import type { PaletteMode } from "@mui/material";

const PRIMARY = {
  light: "#9C4DCC",
  main: "#6A1B9A",
  dark: "#38006B",
};

const GREY = {
  100: "#FFFFFF",
  200: "#F5F5F5",
  300: "#E0E0E0",
  400: "#BDBDBD",
  500: "#9E9E9E",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  grey: GREY,
  action: {
    active: GREY[500],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  ...COMMON,
  text: { primary: GREY[900], secondary: GREY[600], disabled: GREY[500] },
  background: { default: GREY[100], paper: GREY[200] },
  mode: "light" as PaletteMode,
};

export default palette;
