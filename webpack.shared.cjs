const emotionSheetVersion = require("@emotion/sheet/package.json").version;
const emotionSerializeVersion = require("@emotion/serialize/package.json").version;
const emotionUtilsVersion = require("@emotion/utils/package.json").version;
const emotionWeakMemoizeVersion =
  require("@emotion/weak-memoize/package.json").version;
const emotionUnitlessVersion = require("@emotion/unitless/package.json").version;
const emotionHashVersion = require("@emotion/hash/package.json").version;
const emotionMemoizeVersion = require("@emotion/memoize/package.json").version;
const muiSystemVersion = require("@mui/system/package.json").version;
const muiStyledEngineVersion =
  require("@mui/styled-engine/package.json").version;
const muiUtilsVersion = require("@mui/utils/package.json").version;
const muiPrivateThemingVersion =
  require("@mui/private-theming/package.json").version;
const muiVersion = require("@mui/material/package.json").version;

const muiSystemSubPaths = [
  "DefaultPropsProvider",
  "Grid",
  "InitColorSchemeScript",
  "RtlProvider",
  "colorManipulator",
  "createBreakpoints",
  "createStyled",
  "createTheme",
  "cssVars",
  "spacing",
  "style",
  "styleFunctionSx",
  "useMediaQuery",
  "useThemeProps",
];

function createSharedConfig(deps) {
  const eager = { eager: true };
  const muiSystemSubPathShares = Object.fromEntries(
    muiSystemSubPaths.map((p) => [
      `@mui/system/${p}`,
      {
        singleton: true,
        requiredVersion: muiSystemVersion,
        version: muiSystemVersion,
        ...eager,
      },
    ]),
  );

  return {
    react: {
      singleton: true,
      requiredVersion: deps.react,
      version: deps.react,
      ...eager,
      allowNodeModulesSuffixMatch: true,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
      version: deps["react-dom"],
      ...eager,
      allowNodeModulesSuffixMatch: true,
    },
    "@emotion/react": {
      singleton: true,
      requiredVersion: deps["@emotion/react"],
      version: deps["@emotion/react"],
      ...eager,
    },
    "@emotion/styled": {
      singleton: true,
      requiredVersion: deps["@emotion/styled"],
      version: deps["@emotion/styled"],
      ...eager,
    },
    "@emotion/cache": {
      singleton: true,
      requiredVersion: deps["@emotion/cache"],
      version: deps["@emotion/cache"],
      ...eager,
    },
    "@emotion/sheet": {
      singleton: true,
      requiredVersion: emotionSheetVersion,
      version: emotionSheetVersion,
      ...eager,
    },
    "@emotion/serialize": {
      singleton: true,
      requiredVersion: emotionSerializeVersion,
      version: emotionSerializeVersion,
      ...eager,
    },
    "@emotion/utils": {
      singleton: true,
      requiredVersion: emotionUtilsVersion,
      version: emotionUtilsVersion,
      ...eager,
    },
    "@emotion/weak-memoize": {
      singleton: true,
      requiredVersion: emotionWeakMemoizeVersion,
      version: emotionWeakMemoizeVersion,
      ...eager,
    },
    "@emotion/unitless": {
      singleton: true,
      requiredVersion: emotionUnitlessVersion,
      version: emotionUnitlessVersion,
      ...eager,
    },
    "@emotion/hash": {
      singleton: true,
      requiredVersion: emotionHashVersion,
      version: emotionHashVersion,
      ...eager,
    },
    "@emotion/memoize": {
      singleton: true,
      requiredVersion: emotionMemoizeVersion,
      version: emotionMemoizeVersion,
      ...eager,
    },
    "@mui/material": {
      singleton: true,
      requiredVersion: deps["@mui/material"],
      version: muiVersion,
      ...eager,
    },
    "@mui/system": {
      singleton: true,
      requiredVersion: muiSystemVersion,
      version: muiSystemVersion,
      ...eager,
    },
    "@mui/styled-engine": {
      singleton: true,
      requiredVersion: muiStyledEngineVersion,
      version: muiStyledEngineVersion,
      ...eager,
    },
    "@mui/utils": {
      singleton: true,
      requiredVersion: muiUtilsVersion,
      version: muiUtilsVersion,
      ...eager,
    },
    "@mui/private-theming": {
      singleton: true,
      requiredVersion: muiPrivateThemingVersion,
      version: muiPrivateThemingVersion,
      ...eager,
    },
    ...muiSystemSubPathShares,
    "react-router-dom": {
      singleton: true,
      requiredVersion: deps["react-router-dom"],
      version: deps["react-router-dom"],
      allowNodeModulesSuffixMatch: true,
    },
  };
}

module.exports = { createSharedConfig };
