import { exec } from "child_process";
import path from "path";

export const sassRule = {
  test: /\.(sa|sc|c)ss$/i,
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "sass-loader",
      options: {
        sassOptions: {
          charset: false,
          indentWidth: 4,
          includePaths: [path.resolve("node_modules")],
        },
      },
    },
  ],
};

export default {
  entry: {
    bundle: {
      import: "./src/index.ts",
      filename: "index.js",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    clean: true,
    library: "Canaille",
    libraryTarget: "umd",
    globalObject: "this",
    publicPath: "auto",
    path: path.resolve("dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      sassRule,
    ],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "react-router-dom": "react-router-dom",
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap(".d.ts Generation", () => {
          exec("npx tsc", (err, stdout, stderr) => {
            if (stdout) process.stdout.write(`Typescript: ${stdout}`);

            if (stderr) process.stderr.write(`Typescript: ${stderr}`);
          });
        });
      },
    },
  ],
};
