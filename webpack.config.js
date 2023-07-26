const path = require("path");
module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  entry: {
    map: "./src/map.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {

    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  watch: true,
  devtool: "eval-source-map",
};
