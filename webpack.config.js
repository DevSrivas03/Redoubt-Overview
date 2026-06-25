const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/webpack");
const { createSharedConfig } = require("./webpack.shared.cjs");

const pkg = require("./package.json");
const deps = pkg.dependencies;

const GH_PAGES_BASE = pkg.homepage
  ? new URL(pkg.homepage).pathname.replace(/\/?$/, "/")
  : "/";
const GH_PAGES_BASENAME = GH_PAGES_BASE.replace(/\/$/, "");

const DEFAULT_LOCAL_DS = "http://localhost:3010/mf-manifest.json";
const DEFAULT_DEV_DS =
  "https://cdn.dev.exigernext.com/design-system/mf-manifest.json";

function resolveDsRemoteUrl(env = {}) {
  const scenario = env.scenario ?? env.ds;
  if (scenario === "ds-local") return DEFAULT_LOCAL_DS;
  if (scenario === "ds-remote") return DEFAULT_DEV_DS;
  return process.env.DS_REMOTE_URL?.trim() || DEFAULT_LOCAL_DS;
}

module.exports = (_env, argv) => {
  const isDev = argv.mode === "development";
  const dsRemoteUrl = resolveDsRemoteUrl(_env);

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      publicPath: isDev ? "/" : GH_PAGES_BASE,
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: { loader: "ts-loader", options: { transpileOnly: true } },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      concatenateModules: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          NODE_ENV: isDev ? "development" : "production",
          DRAGGABLE_DEBUG: "",
          BASE_PATH: isDev ? "" : GH_PAGES_BASENAME,
        }),
      }),
      new ModuleFederationPlugin({
        name: "overview",
        remotes: {
          ds: `ds@${dsRemoteUrl}`,
        },
        shared: createSharedConfig(deps),
        dts: isDev
          ? false
          : {
              generateTypes: false,
              consumeTypes: true,
            },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    devServer: {
      port: Number(process.env.PORT) || 3015,
      historyApiFallback: true,
      hot: true,
      open: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    devtool: isDev ? "source-map" : false,
  };
};
